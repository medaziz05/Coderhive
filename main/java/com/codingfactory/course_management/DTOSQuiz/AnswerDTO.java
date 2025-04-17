package com.codingfactory.course_management.DTOSQuiz;


import com.codingfactory.course_management.entity.Answer;

public record AnswerDTO(String answerLetter, String answerTitle) {

    public Answer toAnswer() {
        return Answer.builder()
                .letter(answerLetter)
                .title(answerTitle)
                .build();
    }

    public AnswerDTO(Answer answer) {
        this(
                answer.getLetter(),
                answer.getTitle()
        );
    }
}