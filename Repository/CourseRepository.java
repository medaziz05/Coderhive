package com.codingfactory.course_management.Repository;

import com.codingfactory.course_management.DTOS.CourseListDTO;
import com.codingfactory.course_management.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByCourseCategory(String category);
    // In CourseRepository.java
    @Query("SELECT NEW com.codingfactory.course_management.DTOS.CourseListDTO(" +
            "c.courseId, c.courseTitle, c.courseCategory, c.coursePaid, c.courseImage, " +
            "NEW com.codingfactory.course_management.DTOS.TeacherSimpleDTO(t.teacherId, t.name), " +
            "c.level) " +
            "FROM Course c JOIN c.teacher t")
    List<CourseListDTO> findAllCourseListItems();

    @Query("SELECT c FROM Course c LEFT JOIN FETCH c.chapters WHERE c.courseId = :id")
    Optional<Course> findByIdWithChapters(@Param("id") Long id);

    @Query("SELECT c FROM Course c " +
            "LEFT JOIN FETCH c.chapters ch " +
            "LEFT JOIN FETCH ch.attachments " +
            "LEFT JOIN FETCH c.teacher " +
            "WHERE c.courseId = :courseId")
    Optional<Course> findCourseWithDetails(@Param("courseId") Long courseId);
    @Modifying
    @Query("UPDATE Course c SET c.courseUpdatedAt = :now WHERE c.courseId = :courseId")
    void touchCourse(@Param("courseId") Long courseId, @Param("now") LocalDateTime now);

}







