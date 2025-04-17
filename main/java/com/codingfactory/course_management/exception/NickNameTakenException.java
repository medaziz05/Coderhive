package com.codingfactory.course_management.exception;

public class NickNameTakenException extends RuntimeException {

    public NickNameTakenException(String nickname) {
        super("The following nickname is already taken: " + nickname);
    }
}