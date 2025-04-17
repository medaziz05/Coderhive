package com.codingfactory.course_management.Service;

import com.codingfactory.course_management.DTOS.*;
import com.codingfactory.course_management.DTOSQuiz.QuizSimpleDTO;
import com.codingfactory.course_management.Repository.ChapterAttachmentRepository;
import com.codingfactory.course_management.Repository.ChapterRepository;
import com.codingfactory.course_management.Repository.CourseRepository;
import com.codingfactory.course_management.Repository.StudentRepository;
import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Student;
import com.codingfactory.course_management.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.codingfactory.course_management.entity.ChapterAttachment;

import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.context.annotation.Lazy;

import java.util.Objects;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;

@Service
public class ChapterService {
    private static final Logger logger = LoggerFactory.getLogger(ChapterService.class);
    private final ChapterRepository chapterRepository;
    private final CourseRepository courseRepository;
    private final FileStorageService fileStorageService;
    private final ChapterAttachmentRepository chapterAttachmentRepository ;
    private final CourseService courseService;
    private final Environment environment;
    private final StudentRepository studentRepository ;


    @Autowired
    public ChapterService(ChapterRepository chapterRepository,
                          CourseRepository courseRepository,
                          FileStorageService fileStorageService, ChapterAttachmentRepository chapterAttachmentRepository, @Lazy CourseService courseService , Environment environment, StudentRepository studentRepository) {
        this.chapterRepository = chapterRepository;
        this.courseRepository = courseRepository;
        this.fileStorageService = fileStorageService;
        this.chapterAttachmentRepository = chapterAttachmentRepository;
        this.courseService = courseService;
        this.environment = environment;
        this.studentRepository = studentRepository;
    }
    @Transactional
    public ChapterDetailsDTO createChapterWithFiles(Long courseId, ChapterRequestDTO chapterRequest, List<MultipartFile> files)
            throws IOException {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Validate unique chapter order
        if (chapterRepository.existsByCourseAndChapterOrder(course, chapterRequest.getChapterOrder())) {
            throw new IllegalArgumentException("Chapter order must be unique per course");
        }

        Chapter chapter = new Chapter();
        chapter.setChapterTitle(chapterRequest.getChapterTitle());
        chapter.setChapterDescription(chapterRequest.getChapterDescription());
        chapter.setChapterOrder(chapterRequest.getChapterOrder());
        chapter.setCourse(course);
        chapter.setChapterLocked(course.isCoursePaid());

        try {
            processAttachments(files, chapter);
        } catch (IOException ex) {
            throw new IOException("Failed to process attachments: " + ex.getMessage());
        }


        Chapter savedChapter = chapterRepository.save(chapter);

        // ✅ Update the course timestamp after saving the chapter
        courseRepository.touchCourse(course.getCourseId(), LocalDateTime.now());

        // Force initialization of relationships
        savedChapter = chapterRepository.findByIdWithAttachments(savedChapter.getChapterId())
                .orElseThrow(() -> new RuntimeException("Chapter not found after creation"));

        return convertToDetailsDTO(savedChapter);
    }

    @Transactional
    public ChapterDetailsDTO updateChapterWithFiles(Long chapterId, ChapterRequestDTO dto, List<MultipartFile> files) throws IOException {
        Chapter existingChapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Validate chapter order
        validateChapterOrder(existingChapter.getCourse(), dto.getChapterOrder(), existingChapter);

        // Update chapter fields
        existingChapter.setChapterTitle(dto.getChapterTitle());
        existingChapter.setChapterDescription(dto.getChapterDescription());
        existingChapter.setChapterOrder(dto.getChapterOrder());
        existingChapter.setChapterUpdatedAt(LocalDateTime.now());

        // Ensure chapterLocked is updated based on course's payment status
        existingChapter.setChapterLocked(existingChapter.getCourse().isCoursePaid());

        // Process any file attachments
        processAttachments(files, existingChapter);

        // Save the updated chapter
        Chapter updatedChapter = chapterRepository.save(existingChapter);

        // ✅ Update course timestamp to reflect the latest modification
        courseRepository.touchCourse(updatedChapter.getCourse().getCourseId(), LocalDateTime.now());

        return convertToDetailsDTO(updatedChapter);
    }


    private void processAttachments(List<MultipartFile> files, Chapter chapter) throws IOException {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (!file.isEmpty()) {
                    // Store the file and get the stored file names (original | preview)
                    String storedFileName = fileStorageService.storeFile(file);
                    // Validate the stored file name
                    if (storedFileName == null || storedFileName.isEmpty()) {
                        throw new IOException("Failed to generate valid filename for attachment");
                    }
                    ChapterAttachment attachment = new ChapterAttachment();
                    attachment.setFileName(file.getOriginalFilename());
                    String[] fileParts = storedFileName.split("\\|");
                    attachment.setFilePath(fileParts[0]);
                    if (fileParts.length > 1) {
                        attachment.setPreviewFilePath(fileParts[1]); // PDF preview for DOCX
                    } else if (Objects.equals(file.getContentType(), "application/pdf")) {
                        attachment.setPreviewFilePath(fileParts[0]); // Use original PDF for preview
                    }
                    attachment.setFileType(file.getContentType());
                    chapter.addAttachment(attachment);
                }
            }
        }
    }

    @Transactional
    public void deleteChapter(Long chapterId) {
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        // Get copy of attachments before deletion
        List<ChapterAttachment> attachments = new ArrayList<>(chapter.getAttachments());

        // Delete chapter (cascade will handle database entries)
        chapterRepository.delete(chapter);

        // Delete associated files from storage after successful DB deletion
        attachments.forEach(attachment -> {
            try {
                fileStorageService.deleteFile(attachment.getFilePath());
            } catch (IOException e) {
                // Log error but don't stop execution
                logger.error("Failed to delete file: {}", attachment.getFilePath(), e);
            }
        });
    }

    @Transactional(readOnly = true)
    public ChapterDetailsDTO getChapterById(Long chapterId) {
        Chapter chapter = chapterRepository.findByIdWithAttachments(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));
        return convertToDetailsDTO(chapter);
    }

    private ChapterDetailsDTO convertToDetailsDTO(Chapter chapter) {
        List<AttachmentDTO> attachmentDTOs = chapter.getAttachments().stream()
                .map(this::convertAttachmentToDTO)
                .collect(Collectors.toList());
        QuizSimpleDTO quizDTO = chapter.getQuiz() != null ?
                new QuizSimpleDTO(chapter.getQuiz()) : null;

        return new ChapterDetailsDTO(
                chapter.getChapterId(),
                chapter.getChapterTitle(),
                chapter.getChapterDescription(),
                chapter.getChapterOrder(),
                chapter.getChapterCreatedAt(),
                chapter.getChapterUpdatedAt(),
                chapter.getCourse().getCourseId(),  // Use courseId from the associated Course
                attachmentDTOs  ,// Include attachments in the chapter details DTO
                quizDTO

        );
    }


    private void validateChapterOrder(Course course, Integer order, Chapter existingChapter) {
        if (existingChapter == null || !order.equals(existingChapter.getChapterOrder())) {
            boolean orderExists = chapterRepository.existsByCourseAndChapterOrder(course, order);
            if (orderExists) {
                throw new IllegalArgumentException("Chapter order must be unique within a course");
            }
        }
    }
    // Convert to ChapterListDTO (used for lists)
    public ChapterListDTO convertToListDTO(Chapter chapter) {
        // We are only interested in a subset of the chapter details for lists, so we return the minimal required fields
        return new ChapterListDTO(
                chapter.getChapterId(),
                chapter.getChapterTitle(),
                chapter.getChapterOrder()
        );
    }


    private AttachmentDTO convertAttachmentToDTO(ChapterAttachment attachment) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setFilePath(attachment.getFilePath());
        // Access the base URL from the environment
        String apiBaseUrl = environment.getProperty("api.base.url");
        dto.setUploadedAt(attachment.getUploadedAt());
        // ✅ Add preview URL mapping
        dto.setPreviewUrl(attachment.getPreviewUrl());

        return dto;
    }
    @Transactional
    public void removeAttachment(Long chapterId, String filePath) {
        logger.info("Attempting to delete attachment - Chapter: {}, File: {}", chapterId, filePath);

        // Normalize and decode the file path
        String normalizedPath = Paths.get(filePath).normalize().toString();
        logger.info("Normalized file path: {}", normalizedPath);

        // Verify chapter exists
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> {
                    logger.error("Chapter not found: {}", chapterId);
                    return new RuntimeException("Chapter not found");
                });

        // Find attachment with normalized path
        ChapterAttachment attachment = chapterAttachmentRepository
                .findByChapterAndFilePath(chapterId, normalizedPath)
                .orElseThrow(() -> {
                    logger.error("Attachment not found - Chapter: {}, Path: {}", chapterId, normalizedPath);
                    logger.info("Existing attachments paths:");
                    chapter.getAttachments().forEach(att -> logger.info("- {}", att.getFilePath()));
                    return new RuntimeException("Attachment not found");
                });

        // Delete from database
        logger.info("Deleting attachment from database: {}", attachment.getId());
        chapterAttachmentRepository.delete(attachment);

        // Delete files
        try {
            logger.info("Deleting physical files - Main: {}, Preview: {}",
                    attachment.getFilePath(),
                    attachment.getPreviewFilePath());

            fileStorageService.deleteFile(attachment.getFilePath());
            if (attachment.getPreviewFilePath() != null) {
                fileStorageService.deleteFile(attachment.getPreviewFilePath());
            }
        } catch (IOException ex) {
            logger.error("File deletion failed for attachment: {}", attachment.getId(), ex);
            throw new RuntimeException("File deletion failed");
        }

        // ✅ Fetch course before updating chapter timestamp
        Course course = chapter.getCourse();

        // ✅ Update timestamps
        logger.info("Updating timestamps for Chapter: {} and Course: {}", chapterId, course.getCourseId());
        chapterRepository.touchChapter(chapterId, LocalDateTime.now());
        courseRepository.touchCourse(course.getCourseId(), LocalDateTime.now());

        logger.info("Attachment removal process completed successfully.");
    }


    public QuizSimpleDTO getChapterQuiz(Long chapterId) {
        Chapter chapter = chapterRepository.findByIdWithQuiz(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));

        if (chapter.getQuiz() == null) {
            throw new ResourceNotFoundException("No quiz found for this chapter");
        }

        return new QuizSimpleDTO(chapter.getQuiz());
    }

    public void validateChapterExists(Long chapterId) {
        if (!chapterRepository.existsById(chapterId)) {
            throw new ResourceNotFoundException("Chapter not found with id: " + chapterId);
        }
    }


    public ChapterDetailsDTO StudentgetChapterById(Long chapterId, Long studentId) throws AccessDeniedException {
        Chapter chapter = chapterRepository.findByIdWithAttachments(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Get the course associated with the chapter
        Course course = chapter.getCourse();

        // If the course is paid, check if the student has an active membership
        if (course.isCoursePaid() && !student.isStudentMembership()) {
            throw new AccessDeniedException("You need an active membership to access this chapter.");
        }

        return convertToDetailsDTO(chapter);
    }


    }


