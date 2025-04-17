package com.codingfactory.course_management.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table
@Getter
@Setter
@EqualsAndHashCode(of = {"title", "correctAnswerLetter"})
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "quiz_id", nullable = false)
    private Quiz quiz;

    @Column
    private String title;

    @Column
    private String correctAnswerLetter;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Answer> answers = new HashSet<>();

}