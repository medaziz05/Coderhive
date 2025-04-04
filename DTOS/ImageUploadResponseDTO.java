package com.codingfactory.course_management.DTOS;

public class ImageUploadResponseDTO {
    private String imageUrl;

    // Constructor
    public ImageUploadResponseDTO(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    // Getter and Setter
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}