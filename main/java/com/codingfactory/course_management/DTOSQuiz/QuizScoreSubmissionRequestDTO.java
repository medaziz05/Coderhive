package com.codingfactory.course_management.DTOSQuiz;

import com.codingfactory.course_management.entity.Score;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record QuizScoreSubmissionRequestDTO(@NotNull Long quizId, @NotBlank String nickname,
                                            @NotNull Integer totalCorrect, @NotBlank String countryCode) {

    public Score toScore(long quizTotalQuestions) {
        return Score.builder()
                .nickName(nickname)
                .totalCorrect(totalCorrect)
                .countryCode(countryCode)
                .score(((float) totalCorrect / (float) quizTotalQuestions)).build();
    }
}
