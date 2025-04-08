package com.pi.trainingenrollment.entities;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;

    private int moduleId;  // Module belongs to TrainingProgram microservice

    private boolean completed;
    private double score;
    private LocalDateTime completedAt;
}
