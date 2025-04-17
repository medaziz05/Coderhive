package com.codingfactory.course_management.Enumeration;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum courselvl {
    BEGINNER, MID_LVL, ADVANCED;

    @JsonCreator
    public static courselvl fromString(String key) {
        for (courselvl lvl : courselvl.values()) {
            if (lvl.name().equalsIgnoreCase(key)) {
                return lvl;
            }
        }
        throw new IllegalArgumentException("Invalid level: " + key);
    }
    @JsonValue
    public String getValue() {
        return this.name();
    }
}