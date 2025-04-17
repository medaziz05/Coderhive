package com.codingfactory.course_management.Web.Api;

import com.codingfactory.course_management.DTOSQuiz.*;
import com.codingfactory.course_management.Service.ChapterService;
import com.codingfactory.course_management.ServiceQuiz.AIQuizGeneratorService;
import com.codingfactory.course_management.ServiceQuiz.QuizSearchService;
import com.codingfactory.course_management.ServiceQuiz.QuizService;
import com.codingfactory.course_management.ServiceQuiz.ScoreService;
import com.codingfactory.course_management.elasticsearch.QuizDocument;
import com.codingfactory.course_management.entity.Quiz;
import com.codingfactory.course_management.entity.Score;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/quiz")
public class QuizRestController {
    private final QuizService quizService;
    private final AIQuizGeneratorService quizGeneratorService;
    private final ChapterService chapterService;
    private final QuizSearchService quizSearchService;
    private final ScoreService scoreService;

    /**
     * {@code GET /api/quiz/:id} : Retrieves a quiz
     *
     * @param id the id of the quiz to retrieve
     * @return {@link ResponseEntity} with status {@code 200 (OK)} and with the body of retrieved quiz
     * or with status {@code 404 (Not Found)} if the quiz identified by the id provided couldn't be found
     */
    @Operation(summary = "Get a quiz by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Found the quiz",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = QuizAIDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Quiz not found",
                    content = @Content)})
    @GetMapping("/{id}")
    public ResponseEntity<QuizDTO> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(this.quizService.getQuizByIdAsDTO(id));
    }

    /**
     * {@code GET /api/quiz} : Search quizzes
     *
     * @param searchOptions search options
     * @return a page of quizzes if any
     */
    @GetMapping
    @Operation(summary = "Search quizzes")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Page",
                    content = {@Content(mediaType = "application/json",
                            schema = @Schema(implementation = Page.class))})}
    )
    public ResponseEntity<Page<QuizDocument>> getAll(@RequestParam Map<String, String> searchOptions) {
        var searchOptionsBuilder = SearchDTO.builder();

        if (searchOptions.containsKey("title")) {
            searchOptionsBuilder.title(searchOptions.get("title"));
        }

        // Changed from categoryId to categoryName
        if (searchOptions.containsKey("categoryName")) {
            searchOptionsBuilder.categoryName(searchOptions.get("categoryName"));
        }

        if (searchOptions.containsKey("questions")) {
            searchOptionsBuilder.numberOfQuestions(Integer.valueOf(searchOptions.get("questions")));
        }

        if (searchOptions.containsKey("sort_difficulty")) {
            searchOptionsBuilder.sortByDifficulty(Sort.Direction.fromString(searchOptions.get("sort_difficulty")));
        }

        if (searchOptions.containsKey("difficulty")) {
            searchOptionsBuilder.difficulty(searchOptions.get("difficulty"));
        }

        if (searchOptions.containsKey("sort_created")) {
            searchOptionsBuilder.sortByCreatedDate(Sort.Direction.fromString(searchOptions.get("sort_created")));
        }

        if (searchOptions.containsKey("page") && searchOptions.containsKey("size")) {
            searchOptionsBuilder.page(Integer.parseInt(searchOptions.get("page")) - 1);
            searchOptionsBuilder.size(Integer.valueOf(searchOptions.get("size")));
        }

        return ResponseEntity.ok(quizSearchService.processSearch(searchOptionsBuilder.build()));
    }
    /**
     * {@code GET /api/quiz/:id/photo} : Returns the AI generated thumbnail of the quiz
     *
     * @param id the quiz
     * @return ResponseEntity containing the byte array representing the photo, along with appropriate headers and HTTP status
     * @throws IOException when file cannot be opened or other file system related errors
     */
    @GetMapping("/{id}/photo")
    @Operation(summary = "Get a quiz thumbnail photo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Quiz photo if quiz is found",
                    content = {@Content(mediaType = "image/png")}),
            @ApiResponse(responseCode = "404", description = "Quiz not found",
                    content = @Content)})
    public ResponseEntity<byte[]> getQuizPhoto(@PathVariable Long id) throws IOException {
        Quiz quiz = quizService.getQuizById(id);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        byte[] photoBytes = quiz.getPhotoInBytes();
        headers.setContentLength(photoBytes.length);
        return new ResponseEntity<>(photoBytes, headers, HttpStatus.OK);
    }

    /**
     * {@code GET /api/quiz/:id/score} :Retrieved list of quiz scores
     *
     * @param quizId the id of the quiz to retrieve the scores for
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with a body containing list of scores for the quiz
     */
    @Operation(summary = "Get scores for a quiz", description = "Retrieves a list of Score objects ordered by score for a given quiz ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successful operation", content = @Content(array = @ArraySchema(schema = @Schema(implementation = Score.class)))),
            @ApiResponse(responseCode = "404", description = "Quiz not found", content = @Content)
    })
    @GetMapping("/{quizId}/score")
    public ResponseEntity<List<ScoreDTO>> getScoresByQuizId(@PathVariable Long quizId) {
        return ResponseEntity.ok(scoreService.getAllByQuizIdOrderedByScore(quizId).stream().map(Score::toScoreDTO).toList());
    }

    /**
     * {@code POST /api/quiz/score} : Saves a new score for a quiz
     *
     * @param requestDTO the request data containing the quiz ID, user ID, and score
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with a body containing the saved {@link ScoreDTO}
     */
    @PostMapping("/score")
    public ResponseEntity<ScoreDTO> saveNewScore(@RequestBody @Valid QuizScoreSubmissionRequestDTO requestDTO) {
        return ResponseEntity.ok(scoreService.saveNewScore(requestDTO).toScoreDTO());
    }

}