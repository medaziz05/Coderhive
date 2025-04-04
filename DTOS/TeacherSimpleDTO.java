package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.entity.Teacher;

public class TeacherSimpleDTO {
    private Long teacherId;
    private String name;

    // Default constructor
    public TeacherSimpleDTO() {
    }

    // Constructor to directly initialize using Teacher object
    public TeacherSimpleDTO(Teacher teacher) {
        this.teacherId = teacher.getTeacherId();
        this.name = teacher.getName();
    }

    // Constructor to initialize using teacherId and name
    public TeacherSimpleDTO(Long teacherId, String name) {
        this.teacherId = teacherId;
        this.name = name;
    }

    // Getters and setters
    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
