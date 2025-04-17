package com.codingfactory.course_management.DTOS;

public class TeacherDTO {
    private Long teacherId;
    private String name;
    private String speciality;

    // Getters and Setters
    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getSpeciality() { return speciality; }
    public void setSpeciality(String speciality) { this.speciality = speciality; }
}
