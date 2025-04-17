package com.codingfactory.course_management.DTOSQuiz;

import com.codingfactory.course_management.entity.Answer;
import com.codingfactory.course_management.entity.Question;

import java.util.List;
import java.util.stream.Collectors;

public record QuestionDTO(
        String question,
        String correctAnswerLetter,
        List<AnswerDTO> answers
) {
    public Question toQuestion() {
        // 1. Build the base question
        Question question = Question.builder()
                .title(this.question)
                .correctAnswerLetter(this.correctAnswerLetter)
                .build();

        // 2. Link answers to the question
        if (answers != null) {
            question.setAnswers(
                    answers.stream().map(answerDTO -> {
                        Answer answer = answerDTO.toAnswer();
                        answer.setQuestion(question);
                        return answer;
                    }).collect(Collectors.toSet())
            );
        }

        return question;
    }



    public QuestionDTO(Question question) {
        this(
                question.getTitle(),
                question.getCorrectAnswerLetter(),
                question.getAnswers().stream()
                        .map(AnswerDTO::new)
                        .toList()
        );
    }
}