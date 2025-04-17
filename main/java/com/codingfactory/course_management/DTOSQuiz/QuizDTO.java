package com.codingfactory.course_management.DTOSQuiz;

import com.codingfactory.course_management.Enumeration.Difficulty;
import com.codingfactory.course_management.entity.Quiz;

import java.time.LocalDateTime;
import java.util.List;

public record QuizDTO(
        Long id,
        String category,
        String title,
        Integer numberOfQuestions,
        Difficulty difficulty,
        List<QuestionDTO> questions,
        LocalDateTime created,
        Long chapterId  ,
         Long courseId
) {

    public QuizDTO(Quiz quiz) {
        this(
                quiz.getId(),
                quiz.getChapter().getCourse().getCourseCategory(), // Direct access
                quiz.getTitle(),
                quiz.getTotalQuestions(),
                quiz.getDifficulty(),
                quiz.getQuestions().stream()
                        .map(QuestionDTO::new)
                        .toList(),
                quiz.getCreated(),
                quiz.getChapter().getChapterId(),
                quiz.getChapter().getCourse().getCourseId()
        );
    }
}