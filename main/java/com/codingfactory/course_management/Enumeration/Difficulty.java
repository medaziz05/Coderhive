package com.codingfactory.course_management.Enumeration;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Difficulty {
    EASY(1),
    MEDIUM(2),
    HARD(3);

    private final int value;
}
