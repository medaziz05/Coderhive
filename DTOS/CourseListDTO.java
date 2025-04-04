package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.Enumeration.courselvl;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class CourseListDTO {
    private Long courseId;
    private String courseTitle;
    private String courseCategory;
    private boolean coursePaid;
    private String courseImage;
    private courselvl level;
    private TeacherSimpleDTO teacher;

    // Getters and setters
    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public String getCourseCategory() {
        return courseCategory;
    }

    public void setCourseCategory(String courseCategory) {
        this.courseCategory = courseCategory;
    }

    public boolean isCoursePaid() {
        return coursePaid;
    }

    public void setCoursePaid(boolean coursePaid) {
        this.coursePaid = coursePaid;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }

    public courselvl getLevel() {
        return level;
    }

    public void setLevel(courselvl level) {
        this.level = level;
    }

    public TeacherSimpleDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(TeacherSimpleDTO teacher) {
        this.teacher = teacher;
    }

    // Required no-args constructor
    public CourseListDTO() {
    }

    // Constructor with parameters
    public CourseListDTO(Long courseId, String courseTitle, String courseCategory, boolean coursePaid,
                         String courseImage, TeacherSimpleDTO teacher, courselvl level) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.courseCategory = courseCategory;
        this.coursePaid = coursePaid;
        this.courseImage = courseImage;
        this.teacher = teacher;
        this.level = level;
    }
}
