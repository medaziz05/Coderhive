package com.codingfactory.course_management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chapters")
public class Chapter {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "chapter_id")
        private Long chapterId;

        @Column(name = "chapter_title", nullable = false)
        private String chapterTitle;

        @Column(name = "chapter_description", columnDefinition = "TEXT")
        private String chapterDescription;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "course_id", nullable = false)
        private Course course;

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "student_id", nullable = false)
        private Student student;

        @Column(name = "chapter_locked", nullable = false)
        private boolean chapterLocked;

        @Column(name = "chapter_content", columnDefinition = "TEXT")
        private String chapterContent;

        @Column(name = "chapter_order", nullable = false)
        private Integer chapterOrder;

        @Column(name = "chapter_createdAt", nullable = false, updatable = false)
        private LocalDateTime chapterCreatedAt = LocalDateTime.now();

        @Column(name = "chapter_updatedAt", nullable = false)
        private LocalDateTime chapterUpdatedAt = LocalDateTime.now();


        public Long getChapterId() {
                return chapterId;
        }

        public void setChapterId(Long chapterId) {
                this.chapterId = chapterId;
        }

        public String getChapterTitle() {
                return chapterTitle;
        }

        public void setChapterTitle(String chapterTitle) {
                this.chapterTitle = chapterTitle;
        }

        public String getChapterDescription() {
                return chapterDescription;
        }

        public void setChapterDescription(String chapterDescription) {
                this.chapterDescription = chapterDescription;
        }

        public Course getCourse() {
                return course;
        }

        public void setCourse(Course course) {
                this.course = course;
        }

        public Student getStudent() {
                return student;
        }

        public void setStudent(Student student) {
                this.student = student;
        }

        public boolean isChapterLocked() {
                return chapterLocked;
        }

        public void setChapterLocked(boolean chapterLocked) {
                this.chapterLocked = chapterLocked;
        }

        public String getChapterContent() {
                return chapterContent;
        }

        public void setChapterContent(String chapterContent) {
                this.chapterContent = chapterContent;
        }

        public Integer getChapterOrder() {
                return chapterOrder;
        }

        public void setChapterOrder(Integer chapterOrder) {
                this.chapterOrder = chapterOrder;
        }

        public LocalDateTime getChapterCreatedAt() {
                return chapterCreatedAt;
        }

        public void setChapterCreatedAt(LocalDateTime chapterCreatedAt) {
                this.chapterCreatedAt = chapterCreatedAt;
        }

        public LocalDateTime getChapterUpdatedAt() {
                return chapterUpdatedAt;
        }

        public void setChapterUpdatedAt(LocalDateTime chapterUpdatedAt) {
                this.chapterUpdatedAt = chapterUpdatedAt;
        }

        @PreUpdate
        public void preUpdate() {
                this.chapterUpdatedAt = LocalDateTime.now();
        }
}