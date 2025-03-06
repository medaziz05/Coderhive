package com.codingfactory.course_management.DTOS;


import com.codingfactory.course_management.Enumeration.courselvl;
import com.codingfactory.course_management.entity.Teacher;

import java.time.LocalDateTime;
import java.util.List;

public class CourseDTO {


        private Long courseId;
        private String courseTitle;
        private String courseCategory;
        private String courseDescription;
        private boolean coursePaid;
    private LocalDateTime courseUpdatedAt ;
    private LocalDateTime courseCreatedAt;
        private courselvl level;
        private double coursePrice;
        private String courseImage;
        private Long teacherId;
        private String teacherName;
        private String teacherSpeciality;

    private List<ChapterDTO> chapters;

    // Add getter and setter
    public List<ChapterDTO> getChapters() {
        return chapters;
    }

    public void setChapters(List<ChapterDTO> chapters) {
        this.chapters = chapters;
    }

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

    public double getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(double coursePrice) {
        this.coursePrice = coursePrice;
    }

    public String getCourseImage() {
        return courseImage;
    }

    public void setCourseImage(String courseImage) {
        this.courseImage = courseImage;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public String getTeacherSpeciality() {
        return teacherSpeciality;
    }

    public void setTeacherSpeciality(String teacherSpeciality) {
        this.teacherSpeciality = teacherSpeciality;
    }

    public LocalDateTime getCourseUpdatedAt() {
        return courseUpdatedAt;
    }

    public void setCourseUpdatedAt(LocalDateTime courseUpdatedAt) {
        this.courseUpdatedAt = courseUpdatedAt;
    }

    public LocalDateTime getCourseCreatedAt() {
        return courseCreatedAt;
    }

    public void setCourseCreatedAt(LocalDateTime courseCreatedAt) {
        this.courseCreatedAt = courseCreatedAt;
    }


    // Getters and Setters

}
