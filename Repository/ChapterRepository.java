package com.codingfactory.course_management.Repository;

import com.codingfactory.course_management.entity.Chapter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChapterRepository extends JpaRepository<Chapter, Long> {
    List<Chapter> findByCourse_CourseId(Long courseId);
}

