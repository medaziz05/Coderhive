package com.codingfactory.course_management.DTOS;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;

public class BackpackRequestDTO {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private MultipartFile image;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public MultipartFile getImage() { return image; }
    public void setImage(MultipartFile image) { this.image = image; }
}
