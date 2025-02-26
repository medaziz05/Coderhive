package com.codingfactory.course_management.Service;

import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.Repository.ChapterRepository;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {

    private final ChapterRepository chapterRepository;

    @Autowired
    public ChapterService(ChapterRepository chapterRepository) {
        this.chapterRepository = chapterRepository;
    }

    // ✅ Add a new chapter
    public Chapter addChapter(Chapter chapter) {
        // ✅ Ensure the course is correctly mapped
        if (chapter.getCourse() == null) {
            Course course = new Course();
            course.setCourseId(1L); // ✅ Assign default course ID (change as needed)
            chapter.setCourse(course);
        }

        // ✅ Assign a default student ID (e.g., 2L for testing)
        Student student = new Student();
        student.setStudentId(2L); // ✅ Set default student ID
        chapter.setStudent(student); // ✅ Add student to the chapter

        // ✅ Set default timestamps (if not already set in the entity)
        chapter.setChapterCreatedAt(LocalDateTime.now());
        chapter.setChapterUpdatedAt(LocalDateTime.now());

        return chapterRepository.save(chapter);
    }

    // ✅ Update an existing chapter
    @Transactional
    public Chapter updateChapter(Long chapterId, Chapter updatedChapter) {
        Optional<Chapter> chapterOptional = chapterRepository.findById(chapterId);

        if (chapterOptional.isPresent()) {
            Chapter existingChapter = chapterOptional.get();

            // Update chapter details with the new ones
            existingChapter.setChapterTitle(updatedChapter.getChapterTitle());
            existingChapter.setChapterDescription(updatedChapter.getChapterDescription());
            existingChapter.setChapterContent(updatedChapter.getChapterContent());
            existingChapter.setChapterLocked(updatedChapter.isChapterLocked());
            existingChapter.setChapterOrder(updatedChapter.getChapterOrder());
            existingChapter.setChapterUpdatedAt(LocalDateTime.now());

            return chapterRepository.save(existingChapter);
        } else {
            throw new RuntimeException("Chapter not found with ID: " + chapterId);
        }
    }

    // ✅ Delete a chapter
    public void deleteChapter(Long chapterId) {
        chapterRepository.deleteById(chapterId);
    }

    // ✅ Get all chapters for a specific course
    public List<Chapter> getChaptersByCourse(Long courseId) {
        return chapterRepository.findByCourse_CourseId(courseId);
    }

    // ✅ Get a single chapter by ID
    public Chapter getChapterById(Long chapterId) {
        return chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found with ID: " + chapterId));
    }
}
