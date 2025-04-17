package com.codingfactory.course_management.ServiceQuiz;

public interface AIImageGeneratorService {
    byte[] generateImage(String prompt, int width, int height);
}
