package com.pi.trainingenrollment.service;

import com.pi.trainingenrollment.entities.Participant;
import com.pi.trainingenrollment.repository.ParticipantRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;

    // Get all participants
    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    // Get participant by ID
    public Participant getParticipantById(int id) {
        return participantRepository.findById(id).orElse(null);
    }

    // Enroll a participant in a training program
    public Participant enrollParticipant(int userId, int trainingProgramId) {
        Participant participant = new Participant();
        participant.setUserId(userId);
        participant.setTrainingProgramId(trainingProgramId);
        participant.setStatus(Participant.Status.ENROLLED);
        return participantRepository.save(participant);
    }

    // Update participant status
    public Participant updateParticipantStatus(int id, Participant.Status status, double grade) {
        Optional<Participant> optionalParticipant = participantRepository.findById(id);
        if (optionalParticipant.isPresent()) {
            Participant participant = optionalParticipant.get();
            participant.setStatus(status);
            if (status == Participant.Status.COMPLETED ) {
                participant.setGrade(grade);
            }
            return participantRepository.save(participant);
        } else {
            throw new RuntimeException("Participant not found");
        }
    }

    // Delete participant
    public void deleteParticipant(int id) {
        participantRepository.deleteById(id);
    }
}
