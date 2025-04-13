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

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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
    @GetMapping("/score/{userId}")
    public ResponseEntity<Integer> getLearningScore(@PathVariable int userId) {
        int score = participantService.calculateLearningScoreByUserId(userId);
        return ResponseEntity.ok(score);
    }
    @GetMapping("/recommend/{userId}")
    public ResponseEntity<String> recommendTraining(@PathVariable int userId) {
        List<Participant> history = participantRepository.findByUserId(userId);
        String recommandation = "Aucune recommandation";

        for (Participant p : history) {
            if (p.getGrade() >= 85 && p.getStatus() == Participant.Status.COMPLETED) {
                if (p.getTrainingProgramId() == 1) {
                    recommandation = "🔥 Essayez notre formation Spring Boot Avancé !";
                } else if (p.getTrainingProgramId() == 2) {
                    recommandation = "🚀 Rejoignez le module Python Data Science !";
                }
            }
        }

        return ResponseEntity.ok(recommandation);
    }

    @PutMapping("/{id}/review")
    public ResponseEntity<Participant> addReview(
            @PathVariable int id,
            @RequestParam int stars,
            @RequestParam(required = false) String comment) {

        Participant participant = participantService.getParticipantById(id);
        participant.setStars(stars);
        participant.setReview(comment);
        return ResponseEntity.ok(participantRepository.save(participant));
    }
    @PostMapping("/register-date")
    public Participant enrollWithDate(@RequestBody Map<String, String> payload) {
        int userId = Integer.parseInt(payload.get("userId"));
        int trainingProgramId = Integer.parseInt(payload.get("trainingProgramId"));
        LocalDate registrationDate = LocalDate.parse(payload.get("registrationDate"));

        return participantService.enrollParticipantWithDate(userId, trainingProgramId, registrationDate);
    }







}
