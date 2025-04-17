package com.codingfactory.course_management.RepositoryQuiz;

import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;


@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // Check existence by chapter
    boolean existsByChapter(Chapter chapter);

    // Find quiz by chapter ID
    @Query("SELECT q FROM Quiz q WHERE q.chapter.chapterId = :chapterId")
    Optional<Quiz> findByChapterId(@Param("chapterId") Long chapterId);

    // Find quiz with relations
    @Query("SELECT q FROM Quiz q " +
            "LEFT JOIN FETCH q.questions ques " +
            "LEFT JOIN FETCH ques.answers " +
            "LEFT JOIN FETCH q.chapter " +
            "WHERE q.id = :quizId")
    Optional<Quiz> findByIdWithQuestionsAndAnswers(@Param("quizId") Long quizId);

    @Modifying
    @Query("DELETE FROM Quiz q WHERE q.chapter.chapterId = :chapterId")
    void deleteByChapterId(@Param("chapterId") Long chapterId);

    @Query("SELECT CASE WHEN COUNT(q) > 0 THEN true ELSE false END " +
            "FROM Quiz q WHERE q.chapter.chapterId = :chapterId")
    boolean existsByChapter_ChapterId(@Param("chapterId") Long chapterId);
}
