package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.ChapterAttachment;
import java.time.LocalDateTime;
import java.util.List;

public class ChapterDTO {
    private String chapterTitle;
    private String chapterDescription;
    private boolean chapterLocked;
    private Integer chapterOrder;
    private LocalDateTime chapterCreatedAt;
    private LocalDateTime chapterUpdatedAt;
    private Long courseId;
    private List<AttachmentDTO> attachments; // Use standalone DTO
    private CourseListDTO course;

    // Proper constructor to map from Chapter entity
    public ChapterDTO(Chapter chapter) {
        this.chapterTitle = chapter.getChapterTitle();
        this.chapterDescription = chapter.getChapterDescription();
        this.chapterLocked = chapter.isChapterLocked();
        this.chapterOrder = chapter.getChapterOrder();
        this.chapterCreatedAt = chapter.getChapterCreatedAt();
        this.chapterUpdatedAt = chapter.getChapterUpdatedAt();
        this.courseId = chapter.getCourse().getCourseId();
        this.attachments = chapter.getAttachments().stream()
                .map(this::convertToAttachmentDTO)
                .toList();
    }
    private AttachmentDTO convertToAttachmentDTO(ChapterAttachment attachment) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setFilePath(attachment.getFilePath()); // Add this line
        dto.setUploadedAt(attachment.getUploadedAt());
        dto.setPreviewUrl(attachment.getPreviewUrl());
        return dto;
    }

    // Getters and Setters
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

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public List<AttachmentDTO> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<AttachmentDTO> attachments) {
        this.attachments = attachments;
    }

    public CourseListDTO getCourse() {
        return course;
    }

    public void setCourse(CourseListDTO course) {
        this.course = course;
    }
}