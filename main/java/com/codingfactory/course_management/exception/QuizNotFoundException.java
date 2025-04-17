package com.codingfactory.course_management.exception;

public class QuizNotFoundException extends RuntimeException {
    public QuizNotFoundException(Long chapterId) {
        super("Quiz not found for chapter ID: " + chapterId);
    }
}