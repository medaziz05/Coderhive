package com.codingfactory.course_management.configurationQuiz;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@ConfigurationProperties(prefix = "application")
public class ApplicationProperties {
    private Path quizPhotosPath;
    private Integer quizPhotoWidth;
    private Integer quizPhotoHeight;


    // Add getters and setters

    public void setQuizPhotosPath(String quizPhotosPath) throws IOException {
        this.quizPhotosPath = Paths.get(quizPhotosPath).toAbsolutePath().normalize();
        Files.createDirectories(this.quizPhotosPath); // Create directory if not exists
    }
    public Path getQuizPhotosPath() {
        return quizPhotosPath;
    }

    public void setQuizPhotosPath(Path quizPhotosPath) {
        this.quizPhotosPath = quizPhotosPath;
    }

    public Integer getQuizPhotoWidth() {
        return quizPhotoWidth;
    }

    public void setQuizPhotoWidth(Integer quizPhotoWidth) {
        this.quizPhotoWidth = quizPhotoWidth;
    }

    public Integer getQuizPhotoHeight() {
        return quizPhotoHeight;
    }

    public void setQuizPhotoHeight(Integer quizPhotoHeight) {
        this.quizPhotoHeight = quizPhotoHeight;
    }
}
