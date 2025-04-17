package com.codingfactory.course_management.DTOS;

import com.codingfactory.course_management.DTOSQuiz.QuizSimpleDTO;
import com.codingfactory.course_management.entity.Chapter;

public class ChapterWithQuizDTO extends ChapterListDTO {
    private QuizSimpleDTO quiz;

    public ChapterWithQuizDTO(Chapter chapter) {
        super(chapter.getChapterId(),
                chapter.getChapterTitle(),
                chapter.getChapterOrder());
        this.quiz = chapter.getQuiz() != null ?
                new QuizSimpleDTO(chapter.getQuiz()) : null;
    }

    public QuizSimpleDTO getQuiz() { return quiz; }
}
