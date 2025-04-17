package com.codingfactory.course_management.DTOSQuiz;

public record ScoreDTO(String nickname, Integer totalCorrect, Integer totalQuestions, Float score, String countryCode) {
}
