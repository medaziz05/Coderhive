package com.codingfactory.course_management.DTOSQuiz;

import com.codingfactory.course_management.entity.Quiz;

public class QuizSimpleDTO {
    private Long id;
    private String title;
    private String category;  // Added field
    private Integer totalQuestions;

    public QuizSimpleDTO(Quiz quiz) {
        this.id = quiz.getId();
        this.title = quiz.getTitle();
        this.category = quiz.getChapter().getCourse().getCourseCategory();
        this.totalQuestions = quiz.getTotalQuestions();
    }

    // Getters/Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}
