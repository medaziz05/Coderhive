package com.pi.trainingenrollment.entities;

public class PredictionRequest {
    private double grade;
    private boolean cheated;
    private boolean statusCompleted;

    // Getters & Setters
    public double getGrade() {
        return grade;
    }

    public void setGrade(double grade) {
        this.grade = grade;
    }

    public boolean isCheated() {
        return cheated;
    }

    public void setCheated(boolean cheated) {
        this.cheated = cheated;
    }

    public boolean isStatusCompleted() {
        return statusCompleted;
    }

    public void setStatusCompleted(boolean statusCompleted) {
        this.statusCompleted = statusCompleted;
    }
}

