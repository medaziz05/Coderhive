package com.pi.trainingenrollment.controller;

import com.pi.trainingenrollment.entities.Participant;
import com.pi.trainingenrollment.service.ParticipantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollment")
@RequiredArgsConstructor
public class ParticipantController {

    private final ParticipantService participantService;
    // Get all participants
    @GetMapping
    public List<Participant> getAllParticipants() {
        return participantService.getAllParticipants();
    }

    // Get participant by ID
    @GetMapping("/{id}")
    public ResponseEntity<Participant> getParticipantById(@PathVariable int id) {
        return ResponseEntity.ok(participantService.getParticipantById(id));
    }

    // Enroll a participant in a training program
    @PostMapping("/enroll")
    public ResponseEntity<Participant> enrollParticipant(@RequestParam int userId, @RequestParam int trainingProgramId) {
        Participant participant = participantService.enrollParticipant(userId, trainingProgramId);
        return ResponseEntity.status(HttpStatus.CREATED).body(participant);
    }

    // Update participant status
    @PutMapping("/{id}/status")
    public ResponseEntity<Participant> updateParticipantStatus(@PathVariable int id,
                                                               @RequestParam Participant.Status status,
                                                               @RequestParam(required = false) double grade) {
        Participant updatedParticipant = participantService.updateParticipantStatus(id, status, grade);
        return ResponseEntity.ok(updatedParticipant);
    }

    // Delete participant
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParticipant(@PathVariable int id) {
        participantService.deleteParticipant(id);
        return ResponseEntity.noContent().build();
    }
}
