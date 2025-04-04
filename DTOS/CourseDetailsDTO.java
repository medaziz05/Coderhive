package com.codingfactory.course_management.DTOS;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDetailsDTO {

    private Long courseId;
    private String courseTitle;
    private String courseDescription;
    private String courseCategory;
    private boolean coursePaid;
    private String level;
    private String courseImage;
    private LocalDateTime courseCreatedAt;
    private LocalDateTime courseUpdatedAt;
    private TeacherSimpleDTO teacher;
    private List<ChapterListDTO> chapters; // Change to ChapterListDTO for listing basic chapter info


    // Constructor that accepts a Course entity and CourseService
    public CourseDetailsDTO(Long courseId, String courseTitle, String courseDescription,
                            String courseCategory, boolean coursePaid, String level,
                            String courseImage, LocalDateTime courseCreatedAt,
                            LocalDateTime courseUpdatedAt, TeacherSimpleDTO teacher,
                            List<ChapterListDTO> chapters) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.courseDescription = courseDescription;
        this.courseCategory = courseCategory;
        this.coursePaid = coursePaid;
        this.level = level;
        this.courseImage = courseImage;
        this.courseCreatedAt = courseCreatedAt;
        this.courseUpdatedAt = courseUpdatedAt;
        this.teacher = teacher;
        this.chapters = chapters;
    }


    // Getters and Setters for all fields...
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

    public String getCourseDescription() {
        return courseDescription;
    }

    public void setCourseDescription(String courseDescription) {
        this.courseDescription = courseDescription;
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

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }

    public LocalDateTime getCourseCreatedAt() {
        return courseCreatedAt;
    }

    public void setCourseCreatedAt(LocalDateTime courseCreatedAt) {
        this.courseCreatedAt = courseCreatedAt;
    }

    public LocalDateTime getCourseUpdatedAt() {
        return courseUpdatedAt;
    }

    public void setCourseUpdatedAt(LocalDateTime courseUpdatedAt) {
        this.courseUpdatedAt = courseUpdatedAt;
    }

    public TeacherSimpleDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(TeacherSimpleDTO teacher) {
        this.teacher = teacher;
    }

    public List<ChapterListDTO> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterListDTO> chapters) {
        this.chapters = chapters;
    }
}
