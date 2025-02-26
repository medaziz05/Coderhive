package com.codingfactory.course_management.DTOS;


import java.time.LocalDateTime;

public class ChapterDTO {
    private Long chapterId;
    private String chapterTitle;
    private String chapterDescription;
    private boolean chapterLocked;
    private String chapterContent;
    private Integer chapterOrder;
    private LocalDateTime chapterCreatedAt;
    private LocalDateTime chapterUpdatedAt;

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
}