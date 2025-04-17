package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.Enumeration.courselvl;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CourseRequestDTO {

    @NotBlank(message = "Course title is required")
    private String courseTitle;

    @NotBlank(message = "Course category is required")
    private String courseCategory;

    @NotBlank(message = "Course description is required")
    private String courseDescription;

    private boolean coursePaid;

    @NotNull(message = "Course level is required")
    private courselvl level;

    private String courseImage;


    // Getters and setters

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

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
    }

    public boolean isCoursePaid() {
        return coursePaid;
    }

    public void setCoursePaid(boolean coursePaid) {
        this.coursePaid = coursePaid;
    }

    public courselvl getLevel() {
        return level;
    }

    public void setLevel(courselvl level) {
        this.level = level;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }
}

