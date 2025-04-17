package com.codingfactory.course_management.entity;

import com.codingfactory.course_management.ServiceQuiz.QuizSearchService;
import com.codingfactory.course_management.elasticsearch.QuizDocument;
import jakarta.persistence.PostPersist;
import jakarta.persistence.PostUpdate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class QuizIndexingListener {
    private final QuizSearchService searchService;

    @Autowired
    public QuizIndexingListener(QuizSearchService searchService) {
        this.searchService = searchService;
    }

    @PostPersist
    @PostUpdate
    public void indexQuiz(Quiz quiz) {
        searchService.createQuizIndex(convertToDocument(quiz));
    }

    private QuizDocument convertToDocument(Quiz quiz) {
        return QuizDocument.builder()
                .id(quiz.getId())
                .title(quiz.getTitle())
                .categoryName(quiz.getCourseCategory())
                .categoryName(quiz.getChapter().getCourse().getCourseCategory())
                .difficulty(quiz.getDifficulty() != null ? quiz.getDifficulty().toString() : null)
                .uniqueCode(quiz.getUniqueCode())
                .questions(quiz.getTotalQuestions())
                .created(quiz.getCreated())
                .build();
    }
}