package com.pi.trainingenrollment.entities;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int userId;
    private int trainingProgramId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private double grade;

    public enum Status {
        ENROLLED, COMPLETED, DROPPED
    }
}
