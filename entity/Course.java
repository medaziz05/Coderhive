package com.codingfactory.course_management.entity;

import com.codingfactory.course_management.Enumeration.courselvl;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "course_id")
    private Long courseId;

    @Column(name = "course_title", nullable = false)
    private String courseTitle;

    @Column(name = "course_category", nullable = false)
    private String courseCategory;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @Column(name = "course_createdAt", nullable = false, updatable = false)
    private LocalDateTime courseCreatedAt = LocalDateTime.now();


    @Column(name = "course_updatedAt", nullable = false)
    private LocalDateTime courseUpdatedAt = LocalDateTime.now();


    @Column(name = "course_description", columnDefinition = "TEXT")
    private String courseDescription;

    @Column(name = "course_paid", nullable = false)
    private boolean coursePaid;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private courselvl level;

    @Column(name = "course_image", columnDefinition = "LONGTEXT")
    private String courseImage;

    @Column(name = "course_price", nullable = false)
    private double coursePrice;

    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private Set<Chapter> chapters;



    @ManyToMany
    @JoinTable(
            name = "course_student",
            joinColumns = @JoinColumn(name = "course_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private Set<Student> students; // ✅ Many-to-many relationship with Student

    public Course() {}

    public Course(Long courseId, String courseTitle, String courseCategory, Teacher teacher,
                  LocalDateTime courseCreatedAt, LocalDateTime courseUpdatedAt, String courseDescription,
                  boolean coursePaid, courselvl level, String courseImage, double coursePrice) {
        this.courseId = courseId;
        this.courseTitle = courseTitle;
        this.courseCategory = courseCategory;
        this.teacher = teacher;
        this.courseCreatedAt = courseCreatedAt;
        this.courseUpdatedAt = courseUpdatedAt;
        this.courseDescription = courseDescription;
        this.coursePaid = coursePaid;
        this.level = level;
        this.courseImage = courseImage;
        this.coursePrice = coursePrice;
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

    public Teacher getTeacher() {
        return teacher;
    }

    public void setTeacher(Teacher teacher) {
        this.teacher = teacher;
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

    public double getCoursePrice() {
        return coursePrice;
    }

    public void setCoursePrice(double coursePrice) {
        this.coursePrice = coursePrice;
    }

    public Set<Chapter> getChapters() {
        return chapters;
    }

    public void setChapters(Set<Chapter> chapters) {
        this.chapters = chapters;
    }

    public Set<Student> getStudents() {
        return students;
    }

    public void setStudents(Set<Student> students) {
        this.students = students;
    }

    @PreUpdate
    public void preUpdate() {
        this.courseUpdatedAt = LocalDateTime.now();
    }
}