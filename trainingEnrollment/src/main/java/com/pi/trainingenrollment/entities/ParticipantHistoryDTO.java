package com.pi.trainingenrollment.entities;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantHistoryDTO {
    private int participantId;
    private String trainingTitle;
    private int grade;
    private String status;
    private String badge;
    private boolean cheated;
}
