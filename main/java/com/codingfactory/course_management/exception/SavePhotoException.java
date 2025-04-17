package com.codingfactory.course_management.exception;

public class SavePhotoException extends RuntimeException {
    // Updated constructor
    public SavePhotoException(String message, Throwable cause) {
        super(message, cause);
    }
}
