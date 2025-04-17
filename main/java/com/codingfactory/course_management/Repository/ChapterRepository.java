package com.codingfactory.course_management.Repository;

import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Quiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    // Fetching chapters by course with attachments
    @Query("SELECT ch FROM Chapter ch LEFT JOIN FETCH ch.attachments WHERE ch.course.courseId = :courseId")
    List<Chapter> findByCourseWithAttachments(@Param("courseId") Long courseId);
    // Simple find by course ID
    List<Chapter> findByCourse_CourseId(Long courseId);
    // Check if a chapter order exists for a given course
    boolean existsByCourseAndChapterOrder(Course course, Integer chapterOrder);
    // Fetch chapter by ID with its attachments
    @Query("SELECT ch FROM Chapter ch " +
            "LEFT JOIN FETCH ch.attachments " +
            "LEFT JOIN FETCH ch.course " + // Add this line
            "WHERE ch.chapterId = :chapterId")
    Optional<Chapter> findByIdWithAttachments(@Param("chapterId") Long chapterId);

    @Modifying
    @Query("UPDATE Chapter c SET c.chapterUpdatedAt = :now WHERE c.chapterId = :chapterId")
    void touchChapter(@Param("chapterId") Long chapterId, @Param("now") LocalDateTime now);

    //quiz relationship with chapter //
    @Query("SELECT ch FROM Chapter ch LEFT JOIN FETCH ch.quiz WHERE ch.chapterId = :chapterId")
    Optional<Chapter> findByIdWithQuiz(@Param("chapterId") Long chapterId);

    @Query("SELECT ch FROM Chapter ch " +
            "LEFT JOIN FETCH ch.attachments " +
            "LEFT JOIN FETCH ch.quiz " +  // Added quiz fetch
            "WHERE ch.chapterId = :chapterId")
    Optional<Chapter> findByIdWithAttachmentsAndQuiz(@Param("chapterId") Long chapterId);

    boolean existsByQuiz(Quiz quiz);
    @Query("SELECT ch FROM Chapter ch LEFT JOIN FETCH ch.course WHERE ch.chapterId = :chapterId")
    Optional<Chapter> findByIdWithCourse(@Param("chapterId") Long chapterId);

}


