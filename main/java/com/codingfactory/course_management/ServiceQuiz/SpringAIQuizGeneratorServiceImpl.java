package com.codingfactory.course_management.ServiceQuiz;

import com.codingfactory.course_management.DTOSQuiz.AnswerDTO;
import com.codingfactory.course_management.DTOSQuiz.QuestionDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizAIDTO;
import com.codingfactory.course_management.Enumeration.Difficulty;
import com.codingfactory.course_management.entity.*;
import com.codingfactory.course_management.exception.AIServiceException;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Retryable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class SpringAIQuizGeneratorServiceImpl implements AIQuizGeneratorService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    private static final String OLLAMA_PROMPT_TEMPLATE = """
        Generate a quiz in JSON format with these specifications:
        {{
            "title": "Quiz about %s",
            "difficulty": "%s",
            "questions": [
                {{
                    "text": "Question text",
                    "options": ["Option A", "Option B", "Option C", "Option D"],
                    "correctAnswer": 0
                }}
            ],
            "thumbnailGenerationPrompt": "A visual representation of %s"
        }}
        Requirements:
        - Generate %d questions
        - Difficulty level: %s
        - Respond ONLY with valid JSON
        - Maintain exactly 4 options per question
        - Use correctAnswer index between 0-3""";

    @Retryable(
            retryFor = {AIServiceException.class, RestClientException.class},
            maxAttempts = 3,
            backoff = @Backoff(delay = 1000, multiplier = 2))
    @Override
    public QuizAIDTO generateQuiz(String topic, Difficulty difficulty, Integer numberOfQuestions) {
        String jsonResponse = "";
        try {
            String formattedPrompt = String.format(
                    OLLAMA_PROMPT_TEMPLATE,
                    topic, difficulty, topic, numberOfQuestions, difficulty
            );

            System.out.println("=== AI PROMPT ===\n" + formattedPrompt);

            PromptTemplate promptTemplate = new PromptTemplate(formattedPrompt, Map.of());
            jsonResponse = chatClient.call(promptTemplate.create())
                    .getResult().getOutput().getContent();

            System.out.println("=== RAW RESPONSE ===\n" + jsonResponse);
            jsonResponse = cleanOllamaJsonResponse(jsonResponse);
            System.out.println("=== CLEANED RESPONSE ===\n" + jsonResponse);

            validateJsonStructure(jsonResponse);

            LlamaQuizResponse llamaResponse = objectMapper.readValue(jsonResponse, LlamaQuizResponse.class);
            validateResponse(llamaResponse);

            return convertToQuizAIDTO(llamaResponse);

        } catch (JsonProcessingException e) {
            throw new AIServiceException("Failed to parse AI response. Response: " + jsonResponse, e);
        } catch (JSONException e) {
            throw new AIServiceException("Invalid JSON structure: " + e.getMessage(), e);
        }
    }

    private String cleanOllamaJsonResponse(String jsonResponse) {
        return jsonResponse
                .replaceAll("(?i)```json", "")
                .replaceAll("```", "")
                .replaceAll("^[^{]*", "")
                .replaceAll("[^}]*$", "")
                .trim();
    }

    private void validateJsonStructure(String json) throws JSONException {
        JSONObject obj = new JSONObject(json);

        if (!obj.has("title") || obj.getString("title").isBlank()) {
            throw new JSONException("Missing or empty title");
        }

        JSONArray questions = obj.optJSONArray("questions");
        if (questions == null || questions.isEmpty()) {
            throw new JSONException("Missing or empty questions array");
        }

        for (int i = 0; i < questions.length(); i++) {
            JSONObject question = questions.getJSONObject(i);
            if (!question.has("text") || question.getString("text").isBlank()) {
                throw new JSONException("Question " + (i+1) + " missing text");
            }

            JSONArray options = question.optJSONArray("options");
            if (options == null || options.length() != 4) {
                throw new JSONException("Question " + (i+1) + " has invalid options");
            }

            if (!question.has("correctAnswer")) {
                throw new JSONException("Question " + (i+1) + " missing correctAnswer");
            }
        }
    }

    private void validateResponse(LlamaQuizResponse response) {
        if (response.questions() == null || response.questions().isEmpty()) {
            throw new AIServiceException("AI failed to generate any questions", null);
        }

        for (LlamaQuizResponse.QuestionResponse q : response.questions()) {
            if (q.options() == null || q.options().size() != 4) {
                throw new AIServiceException(
                        "AI generated invalid options count: " +
                                (q.options() != null ? q.options().size() : "null"),
                        null
                );
            }
            if (q.correctAnswerIndex() < 0 || q.correctAnswerIndex() > 3) {
                throw new AIServiceException(
                        "Invalid correct answer index: " + q.correctAnswerIndex(),
                        null
                );
            }
        }
    }

    private QuizAIDTO convertToQuizAIDTO(LlamaQuizResponse response) {
        List<QuestionDTO> questions = response.questions().stream()
                .map(q -> {
                    List<AnswerDTO> answers = IntStream.range(0, q.options().size())
                            .mapToObj(index -> new AnswerDTO(
                                    Character.toString((char) ('A' + index)),
                                    q.options().get(index)
                            ))
                            .collect(Collectors.toList());

                    return new QuestionDTO(
                            q.text(),
                            Character.toString((char) ('A' + q.correctAnswerIndex())),
                            answers
                    );
                })
                .collect(Collectors.toList());

        return new QuizAIDTO(
                null,
                null, // Category will be set from chapter in toQuiz()
                response.title(),
                questions.size(),
                difficultyFromString(response.difficulty()),
                questions,
                response.thumbnailGenerationPrompt()
        );
    }

    private Difficulty difficultyFromString(String difficulty) {
        try {
            return Difficulty.valueOf(difficulty.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new AIServiceException("Invalid difficulty level: " + difficulty, e);
        }
    }

    private record LlamaQuizResponse(
            String title,
            String difficulty,
            String thumbnailGenerationPrompt,
            List<QuestionResponse> questions
    ) {
        record QuestionResponse(
                String text,
                List<String> options,
                @JsonProperty("correctAnswer")
                int correctAnswerIndex
        ) {}
    }
}