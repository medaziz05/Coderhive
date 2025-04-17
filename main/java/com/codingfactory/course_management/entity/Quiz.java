package com.codingfactory.course_management.entity;

import com.codingfactory.course_management.DTOSQuiz.AnswerDTO;
import com.codingfactory.course_management.DTOSQuiz.QuestionDTO;
import com.codingfactory.course_management.DTOSQuiz.QuizDTO;

import com.codingfactory.course_management.Enumeration.Difficulty;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@EntityListeners(QuizIndexingListener.class)
@Table
@Getter
@Setter
@EqualsAndHashCode(of = {"uniqueCode"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Quiz {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    private Long id;

    @Column(unique = true)
    private String uniqueCode;

    @Column
    private String title;

    @Column
    private String photoPath;

    @Column
    private Integer totalQuestions;

    @Column
    @Enumerated(EnumType.STRING)
    private Difficulty difficulty;

    @Column
    private LocalDateTime created;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private Set<Question> questions;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL)
    private Set<Score> scores;
    public String getCourseCategory() {
        if (this.chapter != null && this.chapter.getCourse() != null) {
            return this.chapter.getCourse().getCourseCategory();
        }
        return null;
    }

    @OneToOne
    @JoinColumn(name = "chapter_id", nullable = false, unique = true)
    @JsonBackReference("chapter-quiz")
    private Chapter chapter;

    public QuizDTO toDTO() {
        return new QuizDTO(
                id,
                getCourseCategory(),
                title,
                totalQuestions,
                difficulty,
                questions.stream()
                        .map(question -> new QuestionDTO(
                                question.getTitle(),
                                question.getCorrectAnswerLetter(),
                                question.getAnswers().stream()
                                        .map(answer -> new AnswerDTO(answer.getLetter(), answer.getTitle()))
                                        .toList()
                        ))
                        .toList(),
                created,
                chapter.getChapterId(),
                chapter.getCourse().getCourseId()
        );
    }


    public byte[] getPhotoInBytes() throws IOException {
        return Files.readAllBytes(Paths.get(photoPath));
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUniqueCode() {
        return uniqueCode;
    }

    public void setUniqueCode(String uniqueCode) {
        this.uniqueCode = uniqueCode;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Difficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(Difficulty difficulty) {
        this.difficulty = difficulty;
    }

    public LocalDateTime getCreated() {
        return created;
    }

    public void setCreated(LocalDateTime created) {
        this.created = created;
    }

    public Set<Question> getQuestions() {
        return questions;
    }

    public void setQuestions(Set<Question> questions) {
        this.questions = questions;
    }

    public Set<Score> getScores() {
        return scores;
    }

    public void setScores(Set<Score> scores) {
        this.scores = scores;
    }



    public Chapter getChapter() {
        return chapter;
    }

    public void setChapter(Chapter chapter) {
        this.chapter = chapter;
    }

    public static class QuizIndexingListener {
    }
}
