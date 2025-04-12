package com.pi.trainingenrollment.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER) // ✅ Relation dynamique
    @JoinColumn(name = "user_id") // nom de la colonne en base
    private User user;
    private boolean cheated;
    private int trainingProgramId;

    @Enumerated(EnumType.STRING)
    private Status status;

    private double grade;

    public enum Status {
        ENROLLED, COMPLETED, DROPPED
    }
}
