package com.codingfactory.course_management.ServiceQuiz;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import com.codingfactory.course_management.DTOSQuiz.QuizAIDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizDTO;
import com.codingfactory.course_management.Repository.ChapterRepository;
import com.codingfactory.course_management.RepositoryQuiz.QuizRepository;
import com.codingfactory.course_management.configurationQuiz.ApplicationProperties;
import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Quiz;
import com.codingfactory.course_management.exception.AIServiceException;
import com.codingfactory.course_management.exception.QuizNotFoundException;
import com.codingfactory.course_management.exception.ResourceNotFoundException;
import com.codingfactory.course_management.exception.SavePhotoException;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *  Quiz Service is responsible for interacting with OpenAI through Spring AI and
 *  generating a Quiz DTO
 */
@Service
@Transactional
@RequiredArgsConstructor
public class QuizService {
    private final ChapterRepository chapterRepository;
    private final QuizRepository quizRepository;
    private final AIImageGeneratorService imageGenerator;
    private final QuizSearchService quizSearchService;
    private final ApplicationProperties appProps;


    /**
     * Save a generated quiz for a given chapter
     *
     * @param quizAIDTO The AI-generated quiz data
     * @param chapterId The chapter to associate with the quiz
     * @return The persisted quiz entity
     */
    @Transactional(rollbackFor = {SavePhotoException.class, AIServiceException.class})
    public Quiz saveQuizForChapter(QuizAIDTO quizAIDTO, Long chapterId) {
        // 1. Generate image using Stability AI
        byte[] imageBytes = imageGenerator.generateImage(
                quizAIDTO.thumbnailGenerationPrompt(),
                appProps.getQuizPhotoWidth(),
                appProps.getQuizPhotoHeight()
        );

        // 2. Fetch chapter WITH COURSE relationship
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new ResourceNotFoundException("Chapter not found"));
        Quiz quiz = quizAIDTO.toQuiz(chapter);
        quiz.setUniqueCode(generateUniqueCode());

        // Verify course exists for the chapter
        Course course = chapter.getCourse();
        if (course == null) {
            throw new IllegalStateException("Chapter " + chapterId + " has no associated course");
        }

        // 3. Create quiz entity with CHAPTER relationship
        Path imagePath = saveQuizImage(quiz.getId(), imageBytes);
        quiz.setPhotoPath(imagePath.toString());

        if(quiz.getQuestions() == null || quiz.getQuestions().isEmpty()) {
            throw new IllegalStateException("Quiz must contain questions");
        }

        quiz.getQuestions().forEach(question -> {
            if(question.getQuiz() == null) {
                throw new IllegalStateException("Question is not linked to quiz");
            }
        });
        // 4. Persist quiz
        return quizRepository.save(quiz);
    }

    private Path saveQuizImage(Long quizId, byte[] imageBytes) {
        try {
            Path path = appProps.getQuizPhotosPath()
                    .resolve(quizId + ".png");

            Files.write(path, imageBytes);
            return path;
        } catch (IOException e) {
            // Get the path string from properties
            String photosPath = appProps.getQuizPhotosPath().toString();
            throw new SavePhotoException(
                    "Failed to save quiz image for ID " + quizId + " in directory: " + photosPath,
                    e
            );
        }
    }

    private String generateUniqueCode() {
        return RandomStringUtils.randomAlphanumeric(8).toUpperCase();
    }

    /**
     * Retrieves a quiz by specified id
     *
     * @param id the id of the quiz to retrieve
     * @return a quiz that is found or else RuntimeException is thrown
     */
    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new QuizNotFoundException(id));
    }

    /**
     * Convenience method that allows us fetch a quiz and use our hibernate session to convert to DTO allowing
     * lazy initialisation to work
     *
     * @param id quiz Id
     * @return a QuizDTO
     */
    public QuizDTO getQuizByIdAsDTO(Long id) {
        return quizRepository.findByIdWithQuestionsAndAnswers(id)
                .orElseThrow(() -> new QuizNotFoundException(id))
                .toDTO();
    }

    /**
     * Saves an already generated quiz photo to disk
     *
     * @param quizPhotoPath the path to save the photo  to
     * @param photoBytes    the bytes for the photo (retrieve from AI or otherwise)
     */
    public void savePhoto(String quizPhotoPath, byte[] photoBytes) {
        try {
            Path path = Paths.get(quizPhotoPath);
            Files.write(path, photoBytes);
        } catch (IOException e) {
            // Updated to use the correct constructor with message + cause
            throw new SavePhotoException(
                    "Failed to save photo at: " + quizPhotoPath + " - " + e.getMessage(),
                    e  // Pass the original exception as cause
            );
        }
    }

    /**
     * Retrieves all quizzes saved in DB
     *
     * @return list of quizzes
     */
    public List<Quiz> getAll() {
        return this.quizRepository.findAll();
    }

    @Transactional
    public void deleteQuiz(Long chapterId, Long quizId) {
        // Verify quiz exists in chapter first
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new QuizNotFoundException(quizId));

        if (!quiz.getChapter().getChapterId().equals(chapterId)) {
            throw new ResourceNotFoundException("Quiz not found in this chapter");
        }

        quizRepository.deleteByChapterId(chapterId);

        if (!quizRepository.existsByChapter_ChapterId(chapterId)) {
            throw new ResourceNotFoundException("No quiz found for chapter");
        }
    }


    public QuizDTO getQuizByChapterId(Long chapterId) {
        Quiz quiz = quizRepository.findByChapterId(chapterId)
                .orElseThrow(() -> new QuizNotFoundException(chapterId));
        return quiz.toDTO();  // Move outside the lambda
    }


    public void deleteQuizByChapterId(Long chapterId) {
        quizRepository.deleteByChapterId(chapterId);
    }
}