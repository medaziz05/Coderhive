package com.codingfactory.course_management.exception;

public class AIServiceException extends RuntimeException {
    public AIServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}