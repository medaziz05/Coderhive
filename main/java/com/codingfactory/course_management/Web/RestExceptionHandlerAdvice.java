package com.codingfactory.course_management.Web;

import com.codingfactory.course_management.exception.*;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandlerAdvice {
    @ExceptionHandler(CategoryNotFoundException.class)
    ProblemDetail handleNotFoundException(CategoryNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }
    @ExceptionHandler(QuizNotFoundException.class)
    public ProblemDetail handleQuizNotFound(QuizNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }


    @ExceptionHandler(NickNameTakenException.class)
    ProblemDetail handleNickNameTakenException(NickNameTakenException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(AIServiceException.class)
    ProblemDetail handleAIServiceException(AIServiceException e) {
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.SERVICE_UNAVAILABLE,
                "AI Service Error: " + e.getMessage()
        );
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ProblemDetail handleResourceNotFound(ResourceNotFoundException e) {
        return ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(SavePhotoException.class)
    ProblemDetail handleSavePhotoException(SavePhotoException e) {
        return ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Image Save Error: " + e.getMessage()
        );
    }

}