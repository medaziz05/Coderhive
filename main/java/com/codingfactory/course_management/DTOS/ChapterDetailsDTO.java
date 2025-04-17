package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.DTOSQuiz.QuizSimpleDTO;
import java.time.LocalDateTime;
import java.util.List;

public class ChapterDetailsDTO {
        private Long chapterId;
        private String chapterTitle;
        private String chapterDescription;
        private Integer chapterOrder;
        private LocalDateTime chapterCreatedAt;
        private LocalDateTime chapterUpdatedAt;
        private Long courseId;
        private List<AttachmentDTO> attachments;
        private QuizSimpleDTO quiz;

        public ChapterDetailsDTO(Long chapterId, String chapterTitle, String chapterDescription,
                                 Integer chapterOrder, LocalDateTime chapterCreatedAt,
                                 LocalDateTime chapterUpdatedAt, Long courseId,
                                 List<AttachmentDTO> attachments, QuizSimpleDTO quiz) {
            this.chapterId = chapterId;
            this.chapterTitle = chapterTitle;
            this.chapterDescription = chapterDescription;
            this.chapterOrder = chapterOrder;
            this.chapterCreatedAt = chapterCreatedAt;
            this.chapterUpdatedAt = chapterUpdatedAt;
            this.courseId = courseId;
            this.attachments = attachments;
            this.quiz = quiz;
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public List<AttachmentDTO> getAttachments() {
        return attachments;  // Updated to return List<AttachmentDTO>
    }

    public void setAttachments(List<AttachmentDTO> attachments) {
        this.attachments = attachments;
    }

    public void setQuiz(QuizSimpleDTO quiz) {
        this.quiz = quiz;
    }

    public QuizSimpleDTO getQuiz() {
        return quiz;
    }
}
