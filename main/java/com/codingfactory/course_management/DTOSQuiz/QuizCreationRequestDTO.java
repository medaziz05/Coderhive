package com.codingfactory.course_management.DTOSQuiz;

import com.codingfactory.course_management.Enumeration.Difficulty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record QuizCreationRequestDTO(
        @NotBlank String topic,
        @NotNull Difficulty difficulty,
        @Min(5) @Max(30) Integer numberOfQuestions
) {}