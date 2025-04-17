package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.entity.Backpack;

import java.time.LocalDateTime;
public class BackpackListDTO {
    private Long backpackId;
    private String title;
    private String imageUrl;
    private LocalDateTime createdAt;

    // Constructor with individual fields
    public BackpackListDTO(Long backpackId, String title, String imageUrl, LocalDateTime createdAt) {
        this.backpackId = backpackId;
        this.title = title;
        this.imageUrl = imageUrl;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getBackpackId() { return backpackId; }
    public String getTitle() { return title; }
    public String getImageUrl() { return imageUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}