package com.codingfactory.course_management.DTOS;

public class ChapterListDTO {

    private Long chapterId;
    private String chapterTitle;
    private Integer chapterOrder;

    // Constructor
    public ChapterListDTO(Long chapterId, String chapterTitle, Integer chapterOrder) {
        this.chapterId = chapterId;
        this.chapterTitle = chapterTitle;
        this.chapterOrder = chapterOrder;
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

    public Integer getChapterOrder() {
        return chapterOrder;
    }

    public void setChapterOrder(Integer chapterOrder) {
        this.chapterOrder = chapterOrder;
    }
}
