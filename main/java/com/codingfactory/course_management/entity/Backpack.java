package com.codingfactory.course_management.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
;import java.time.LocalDateTime;

@Entity
@Table(name = "backpacks")
public class Backpack {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "backpack_id")
    private Long backpackId;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "image_url", columnDefinition = "LONGTEXT")
    private String imageUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;

    // Constructors
    public Backpack() {
    }

    public Backpack(String title, String content, String imageUrl, Long teacherId) {
        this.title = title;
        this.content = content;
        this.imageUrl = imageUrl;
        this.teacherId = teacherId;
    }

    // Getters and Setters
    public Long getBackpackId() { return backpackId; }
    public void setBackpackId(Long backpackId) { this.backpackId = backpackId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public Long getTeacherId() { return teacherId; }
    public void setTeacherId(Long teacherId) { this.teacherId = teacherId; }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

}