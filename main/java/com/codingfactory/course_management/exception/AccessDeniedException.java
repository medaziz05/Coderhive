package com.codingfactory.course_management.exception;

public class AccessDeniedException extends RuntimeException {
    private String message;

    public AccessDeniedException(String message) {
        super(message);
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
