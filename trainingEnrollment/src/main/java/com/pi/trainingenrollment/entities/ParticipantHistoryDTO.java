package com.pi.trainingenrollment.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantHistoryDTO {
    private int participantId;
    private String trainingTitle;   // depuis trainingprogram-service
    private int grade;
    private String badge;
    private String status;
    private boolean cheated;
}
