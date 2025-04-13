package com.pi.trainingenrollment.controller;

import com.pi.trainingenrollment.client.TrainingProgramClient;
import com.pi.trainingenrollment.entities.Participant;
import com.pi.trainingenrollment.entities.ParticipantHistoryDTO;
import com.pi.trainingenrollment.model.TrainingProgram;
import com.pi.trainingenrollment.repository.ParticipantRepository;
import com.pi.trainingenrollment.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollment")
@RequiredArgsConstructor
public class ParticipantController {
private  final ParticipantRepository participantRepository;
    private final ParticipantService participantService;
    @Autowired
    private TrainingProgramClient trainingProgramClient;

    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipants();
    }

    @PostMapping("/enroll")
    public ResponseEntity<Participant> enrollParticipant(@RequestParam int userId, @RequestParam int trainingProgramId) {
        Participant participant = participantService.enrollParticipant(userId, trainingProgramId);
        return ResponseEntity.status(HttpStatus.CREATED).body(participant);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Participant> updateParticipantStatus(@PathVariable int id,
                                                               @RequestParam Participant.Status status,
                                                               @RequestParam(required = false) double grade) {
        Participant updated = participantService.updateParticipantStatus(id, status, grade);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable int id) {
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable int id) {
        return ResponseEntity.ok(participantService.getParticipantById(id));
    }


    @GetMapping("/history/{userId}")
    public List<ParticipantHistoryDTO> getHistory(@PathVariable int userId) {
        List<Participant> participants = participantRepository.findByUser_Id(userId);
        List<ParticipantHistoryDTO> history = new ArrayList<>();

        for (Participant p : participants) {
            TrainingProgram tp = trainingProgramClient.getTrainingProgramById(p.getTrainingProgramId());

            String badge = "En cours"; // ou badgeService.getBadge(...)

            ParticipantHistoryDTO dto = new ParticipantHistoryDTO(
                    p.getId(),
                    tp.getTitle(),
                    (int) p.getGrade(),
                    p.getStatus().toString(),
                    badge,
                    p.isCheated()
            );

            history.add(dto);
        }

        return history;
    }


}
