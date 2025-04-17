package com.codingfactory.course_management.DTOS;

import jakarta.validation.constraints.*;

public class ChapterRequestDTO {
    @NotBlank(message = "Chapter title is required")
    @Size(max = 100, message = "Title must be less than 100 characters")
    private String chapterTitle;

    @NotBlank(message = "Chapter description is required")
    @Size(max = 500, message = "Description must be less than 500 characters")
    private String chapterDescription;

    @NotNull(message = "Order is required")
    @Min(value = 1, message = "Order must be at least 1")
    private Integer chapterOrder;


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

    public Integer getChapterOrder() {
        return chapterOrder;
    }

    public void setChapterOrder(Integer chapterOrder) {
        this.chapterOrder = chapterOrder;
    }
}
