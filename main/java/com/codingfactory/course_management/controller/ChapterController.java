package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.DTOS.*;
import com.codingfactory.course_management.Service.ChapterService;
import com.codingfactory.course_management.Service.StudentService;
import com.codingfactory.course_management.ServiceQuiz.AIQuizGeneratorService;
import com.codingfactory.course_management.ServiceQuiz.QuizService;
import com.codingfactory.course_management.ServiceQuiz.SpringAIQuizGeneratorServiceImpl;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.AccessDeniedException;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/courses/{courseId}/chapters")
@Tag(name = "Chapters", description = "Manage chapters")
@CrossOrigin(origins = "http://localhost:4200")
public class ChapterController {
    private final QuizService quizService;
    private final ChapterService chapterService;
    private final AIQuizGeneratorService quizGeneratorService;
    private final StudentService studentService ;

    public ChapterController(QuizService quizService, @Lazy ChapterService chapterService, AIQuizGeneratorService quizGeneratorService, SpringAIQuizGeneratorServiceImpl springAIQuizGeneratorServiceImpl, AIQuizGeneratorService quizGeneratorService1, StudentService studentService) {
        this.quizService = quizService;
        this.chapterService = chapterService;
        this.quizGeneratorService = quizGeneratorService1;
        this.studentService = studentService;
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<String> handleIOException(IOException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("File processing error: " + ex.getMessage());
    }

    // ✅ Add Chapter
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addChapter(
            @PathVariable Long courseId,
            @Valid @RequestPart("chapterRequest") ChapterRequestDTO chapterRequestDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) {

        try {
            ChapterDetailsDTO newChapter = chapterService.createChapterWithFiles(courseId, chapterRequestDTO, files);
            return new ResponseEntity<>(newChapter, HttpStatus.CREATED);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("File processing error: " + ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.internalServerError()
                    .body("Server error: " + ex.getMessage());
        }
    }


    // ✅ Get Chapter by ID
    @GetMapping("/{chapterId}")
    public ResponseEntity<ChapterDetailsDTO> getChapterById(
            @PathVariable Long courseId,
            @PathVariable Long chapterId) {
        try {
            ChapterDetailsDTO chapter = chapterService.getChapterById(chapterId);
            return ResponseEntity.ok(chapter);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    // ✅ Update Chapter
    @PutMapping("/{chapterId}")
    public ResponseEntity<ChapterDetailsDTO> updateChapter(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            @RequestPart("chapterRequest") ChapterRequestDTO updatedChapter,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        ChapterDetailsDTO updatedChapterDetails = chapterService.updateChapterWithFiles(chapterId, updatedChapter, files);
        return new ResponseEntity<>(updatedChapterDetails, HttpStatus.OK);
    }

    @DeleteMapping("/{chapterId}/attachments/{filePath}")
    public ResponseEntity<Void> removeAttachment(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            @PathVariable String filePath) {

        log.info("DELETE ATTACHMENT REQUEST - Course: {}, Chapter: {}, File: {}",
                courseId, chapterId, filePath);

        try {
            String decodedFilePath = URLDecoder.decode(filePath, StandardCharsets.UTF_8);
            log.debug("Decoded file path: {}", decodedFilePath);
            chapterService.removeAttachment(chapterId, decodedFilePath);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Attachment deletion failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Deletion failed");
        }
    }
    // ✅ Delete Chapter
    @DeleteMapping("/{chapterId}")
    public ResponseEntity<Void> deleteChapter(@PathVariable Long courseId, @PathVariable Long chapterId) {
        try {
            chapterService.deleteChapter(chapterId);
            return ResponseEntity.noContent().build(); // 204 No content
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/{chapterId}/student/{studentId}")
    public ResponseEntity<?> getChapterForStudent(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            @PathVariable Long studentId) throws AccessDeniedException {
        try {
            // Call service to check access and get chapter details for the student
            ChapterDetailsDTO chapterDetails = chapterService.StudentgetChapterById(chapterId, studentId);
            return ResponseEntity.ok(chapterDetails);
        } catch (AccessDeniedException ex) {
            // Throwing the AccessDeniedException which will be caught by the global exception handler
            throw new AccessDeniedException("You need an active membership to access this chapter.");
        } catch (Exception e) {
            log.error("Error fetching chapter details for student: {}", e.getMessage());
            throw new RuntimeException("An unexpected error occurred.");
        }
    }


}
