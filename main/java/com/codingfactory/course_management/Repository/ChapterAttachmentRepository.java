package com.codingfactory.course_management.Repository;

import com.codingfactory.course_management.entity.ChapterAttachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChapterAttachmentRepository extends JpaRepository<ChapterAttachment, Long> {

    // Find attachment by stored filename (UUID)
    Optional<ChapterAttachment> findByFilePath(String filePath);

    // Find all attachments for a chapter
    @Query("SELECT a FROM ChapterAttachment a WHERE a.chapter.chapterId = :chapterId")
    List<ChapterAttachment> findByChapterId(@Param("chapterId") Long chapterId);
    Optional<ChapterAttachment> findByPreviewFilePath(String previewFilePath);
    @Query("SELECT a FROM ChapterAttachment a WHERE a.chapter.chapterId = :chapterId AND LOWER(a.filePath) = LOWER(:filePath)")
    Optional<ChapterAttachment> findByChapterAndFilePath(
            @Param("chapterId") Long chapterId,
            @Param("filePath") String filePath);

}