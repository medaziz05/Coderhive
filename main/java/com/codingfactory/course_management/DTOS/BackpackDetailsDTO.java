package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.entity.Backpack;

import java.time.LocalDateTime;
public class BackpackDetailsDTO {
    private Long backpackId;
    private String title;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long teacherId;

    // Constructor with all fields
    public BackpackDetailsDTO(Long backpackId, String title, String content,
                              String imageUrl, LocalDateTime createdAt,
                              LocalDateTime updatedAt, Long teacherId) {
        this.backpackId = backpackId;
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.teacherId = teacherId;
    }

    // Getters
    public Long getBackpackId() { return backpackId; }
    public String getTitle() { return title; }
    public String getContent() { return content; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public Long getTeacherId() { return teacherId; }
}