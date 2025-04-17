package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.Enumeration.courselvl;
import com.codingfactory.course_management.entity.Course;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;

public class CourseDTO {
    private Long courseId;
    private String courseTitle;
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String courseCategory;
    private String courseDescription;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private courselvl level;
    private boolean coursePaid;
    private String courseImage;
    private LocalDateTime courseCreatedAt;
    private LocalDateTime courseUpdatedAt;
    @JsonIgnoreProperties({"courses", "chapters"})
    private TeacherSimpleDTO teacher;



    public CourseDTO(Course course) {
        this.courseId = course.getCourseId();
        this.courseTitle = course.getCourseTitle();
        this.courseCategory = course.getCourseCategory();
        this.courseDescription = course.getCourseDescription();
        this.coursePaid = course.isCoursePaid();
        this.level = course.getLevel();
        this.courseImage = course.getCourseImage();
        this.courseCreatedAt = course.getCourseCreatedAt();
        this.courseUpdatedAt = course.getCourseUpdatedAt();

        // Set teacher information
        if (course.getTeacher() != null) {
            this.teacher = new TeacherSimpleDTO(course.getTeacher());
        }
    }
    // Getters and Setters
    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseTitle() { return courseTitle; }
    public void setCourseTitle(String courseTitle) { this.courseTitle = courseTitle; }

    public String getCourseCategory() { return courseCategory; }
    public void setCourseCategory(String courseCategory) { this.courseCategory = courseCategory; }

    public String getCourseDescription() { return courseDescription; }
    public void setCourseDescription(String courseDescription) { this.courseDescription = courseDescription; }

    public boolean isCoursePaid() { return coursePaid; }
    public void setCoursePaid(boolean coursePaid) { this.coursePaid = coursePaid; }

    public courselvl getLevel() { return level; }
    public void setLevel(courselvl level) { this.level = level; }


    public String getCourseImage() { return courseImage; }
    public void setCourseImage(String courseImage) { this.courseImage = courseImage; }

    public LocalDateTime getCourseCreatedAt() { return courseCreatedAt; }
    public void setCourseCreatedAt(LocalDateTime courseCreatedAt) { this.courseCreatedAt = courseCreatedAt; }

    public LocalDateTime getCourseUpdatedAt() { return courseUpdatedAt; }
    public void setCourseUpdatedAt(LocalDateTime courseUpdatedAt) { this.courseUpdatedAt = courseUpdatedAt; }

    public TeacherSimpleDTO getTeacher() { return teacher; }
    public void setTeacher(TeacherSimpleDTO teacher) { this.teacher = teacher; }

}