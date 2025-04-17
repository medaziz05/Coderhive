package com.codingfactory.course_management.DTOSQuiz;


import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.codingfactory.course_management.Enumeration.Difficulty;
import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.Question;
import com.codingfactory.course_management.entity.Quiz;
import org.apache.commons.lang3.RandomStringUtils;

public record QuizAIDTO(
        Long id,
        String category,
        String title,
        Integer numberOfQuestions,
        Difficulty difficulty,
        List<QuestionDTO> questions,
        String thumbnailGenerationPrompt
) {
    public Quiz toQuiz(Chapter chapter) {
        // 1. First create the quiz WITHOUT questions
        Quiz quiz = Quiz.builder()
                .title(title)
                .uniqueCode(RandomStringUtils.randomAlphanumeric(6))
                .chapter(chapter)
                .totalQuestions(numberOfQuestions)
                .difficulty(difficulty)
                .questions(new HashSet<>()) // Initialize empty set first
                .build();

        // 2. Create questions and link them to the quiz
        Set<Question> questionEntities = questions.stream()
                .map(questionDTO -> {
                    Question question = questionDTO.toQuestion();
                    question.setQuiz(quiz); // Critical bidirectional link
                    return question;
                })
                .collect(Collectors.toSet());

        // 3. Add the fully linked questions to the quiz
        quiz.setQuestions(questionEntities);

        return quiz;
    }
}