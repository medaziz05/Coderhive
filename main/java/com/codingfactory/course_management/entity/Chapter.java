package com.codingfactory.course_management.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

        @ManyToOne(fetch = FetchType.EAGER)
        @JoinColumn(name = "course_id", nullable = false)
        @JsonIgnoreProperties({"chapters", "students", "teacher"})
        private Course course;

        @Column(name = "chapter_locked", nullable = false)
        private boolean chapterLocked;

        @Column(name = "chapter_order", nullable = false)
        private Integer chapterOrder;

        @Column(name = "chapter_createdAt", nullable = false, updatable = false)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
        private LocalDateTime chapterCreatedAt;

        @Column(name = "chapter_updatedAt", nullable = false)
        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS")
        private LocalDateTime chapterUpdatedAt;


        @OneToOne(mappedBy = "chapter",
                cascade = CascadeType.ALL,
                orphanRemoval = true)
        @JsonManagedReference("chapter-quiz")
        private Quiz quiz;
        public void setQuiz(Quiz quiz) {
                if (quiz == null) {
                        if (this.quiz != null) {
                                this.quiz.setChapter(null);
                        }
                } else {
                        quiz.setChapter(this);
                }
                this.quiz = quiz;
        }


        @OneToMany(mappedBy = "chapter", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
        @JsonManagedReference // Add this annotation to manage serialization of attachments
        private List<ChapterAttachment> attachments = new ArrayList<>();
        // Constructor to initialize attachments list
        public Chapter() {
                this.attachments = new ArrayList<>();
        }

        // Helper method to add attachment
        public void addAttachment(ChapterAttachment attachment) {
                attachments.add(attachment);
                attachment.setChapter(this);
        }

        // Lifecycle Callbacks
        @PrePersist
        protected void onCreate() {
                chapterCreatedAt = LocalDateTime.now();
                chapterUpdatedAt = chapterCreatedAt;
        }


        @PreUpdate
        protected void onUpdate() {
                chapterUpdatedAt = LocalDateTime.now();
        }

        // Getters and Setters
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

        public boolean isChapterLocked() {
                return chapterLocked;
        }

        public void setChapterLocked(boolean chapterLocked) {
                this.chapterLocked = chapterLocked;
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

        public List<ChapterAttachment> getAttachments() {
                return attachments;
        }

        public void setAttachments(List<ChapterAttachment> attachments) {
                this.attachments = attachments;
        }

        public Quiz getQuiz() {
                return quiz;
        }
}
