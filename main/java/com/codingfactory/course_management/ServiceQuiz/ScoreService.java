package com.codingfactory.course_management.ServiceQuiz;

import java.util.List;
import java.util.Optional;

import com.codingfactory.course_management.DTOSQuiz.QuizScoreSubmissionRequestDTO;
import com.codingfactory.course_management.RepositoryQuiz.ScoreRepository;
import com.codingfactory.course_management.entity.Quiz;
import com.codingfactory.course_management.entity.Score;
import com.codingfactory.course_management.exception.NickNameTakenException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final QuizService quizService;

    /**
     * Saves a new score for the players
     *
     * @param scoreDto the request DTO containing info for the new score
     * @return a persisted score entity
     */
    @Transactional
    public Score saveNewScore(QuizScoreSubmissionRequestDTO scoreDto) {
        if (getOneByNickname(scoreDto.nickname(), scoreDto.quizId()).isPresent()) {
            throw new NickNameTakenException(scoreDto.nickname());
        }
        Quiz quiz = quizService.getQuizById(scoreDto.quizId());
        Score newQuizScore = scoreDto.toScore(quiz.getTotalQuestions());
        newQuizScore.setQuiz(quiz);
        return scoreRepository.save(newQuizScore);
    }

    /**
     * Retrieve all quiz scores by the quiz id
     *
     * @param quizId the quiz id to get the scores of
     * @return a list of quiz sc
     */
    public List<Score> getAllByQuizIdOrderedByScore(Long quizId) {
        return scoreRepository.findAllByQuizIdOrderByScoreDesc(quizId);
    }

    public Optional<Score> getOneByNickname(String nickname, Long quizId) {
        return scoreRepository.findOneByNickNameAndQuizId(nickname, quizId);
    }

}
