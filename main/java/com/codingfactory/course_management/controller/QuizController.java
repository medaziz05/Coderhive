package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.DTOS.ChapterDetailsDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizAIDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizCreationRequestDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizDTO;
import com.codingfactory.course_management.Service.ChapterService;
import com.codingfactory.course_management.ServiceQuiz.AIQuizGeneratorService;
import com.codingfactory.course_management.ServiceQuiz.QuizService;
import com.codingfactory.course_management.entity.Quiz;
import com.codingfactory.course_management.exception.AIServiceException;
import com.codingfactory.course_management.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/courses/{courseId}/chapters/{chapterId}/quiz")
@Tag(name = "Chapter Quizzes", description = "Manage chapter quizzes")
@CrossOrigin(origins = "http://localhost:4200")
public class QuizController {

    private final QuizService quizService;
    private final ChapterService chapterService;
    private final AIQuizGeneratorService quizGeneratorService;

    private static final Logger logger = LoggerFactory.getLogger(QuizController.class);

    public QuizController(QuizService quizService,
                          ChapterService chapterService,
                          AIQuizGeneratorService quizGeneratorService) {
        this.quizService = quizService;
        this.chapterService = chapterService;
        this.quizGeneratorService = quizGeneratorService;
    }


    private void validateChapterAssociation(Long courseId, Long chapterId) {
        ChapterDetailsDTO chapter = chapterService.getChapterById(chapterId);
        if (!chapter.getCourseId().equals(courseId)) {
            throw new ResourceNotFoundException("Chapter not found in this course");
        }
    }


    // In QuizController.java
    @PostMapping
    @Operation(summary = "Create quiz for chapter")
    public ResponseEntity<QuizDTO> createQuiz(
            @PathVariable Long courseId,
            @PathVariable Long chapterId,
            @RequestBody @Valid QuizCreationRequestDTO requestDTO) {

        logger.info("Creating quiz for chapter {}: {}", chapterId, requestDTO);
        validateChapterAssociation(courseId, chapterId);

        try {
            QuizAIDTO generatedQuiz = quizGeneratorService.generateQuiz(
                    requestDTO.topic(),
                    requestDTO.difficulty(),
                    requestDTO.numberOfQuestions()
            );

            Quiz quiz = quizService.saveQuizForChapter(generatedQuiz, chapterId);
            logger.info("Successfully created quiz ID: {}", quiz.getId());

            return ResponseEntity.created(buildQuizLocation(courseId, chapterId))
                    .body(quiz.toDTO());

        } catch (AIServiceException e) {
            logger.error("AI Service Failure - Reason: {}", e.getMessage());
            logger.debug("AI Service Error Details: ", e);
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,  // More appropriate than SERVICE_UNAVAILABLE
                    "Quiz generation failed: " + e.getMessage()
            );
        } catch (Exception e) {
            logger.error("Unexpected error creating quiz: {}", e.getMessage());
            throw new ResponseStatusException(
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "Failed to create quiz: " + e.getMessage()
            );
        }
    }


    @GetMapping
    @Operation(summary = "Get chapter quiz")
    public ResponseEntity<QuizDTO> getQuiz(
            @PathVariable Long courseId,
            @PathVariable Long chapterId) {

        validateChapterAssociation(courseId, chapterId);
        return ResponseEntity.ok(quizService.getQuizByChapterId(chapterId));
    }


    @DeleteMapping
    @Operation(summary = "Delete chapter quiz")
    public ResponseEntity<Void> deleteQuiz(
            @PathVariable Long courseId,
            @PathVariable Long chapterId) {

        validateChapterAssociation(courseId, chapterId);
        quizService.deleteQuizByChapterId(chapterId);
        return ResponseEntity.noContent().build();
    }


    private URI buildQuizLocation(Long courseId, Long chapterId) {
        return ServletUriComponentsBuilder
                .fromCurrentRequest()
                .build()
                .toUri();
    }

}
