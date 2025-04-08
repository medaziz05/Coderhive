package com.pi.trainingprogram.controller;

import com.pi.trainingprogram.entities.TrainingProgram;
import com.pi.trainingprogram.service.TrainingProgramService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/training")
@RequiredArgsConstructor
public class TrainingProgramController {
    private final TrainingProgramService trainingProgramService;

    @GetMapping
    public List<TrainingProgram> getAllTrainingPrograms() {
        return trainingProgramService.getAllTrainingPrograms();
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingProgram> getTrainingProgramById(@PathVariable int id) {
        return ResponseEntity.ok(trainingProgramService.getTrainingProgramById(id));
    }

    @PostMapping
    public TrainingProgram createTrainingProgram(@RequestBody TrainingProgram trainingProgram) {
        return trainingProgramService.createTrainingProgram(trainingProgram);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingProgram> updateTrainingProgram(
            @PathVariable int id, @RequestBody TrainingProgram trainingProgram) {
        return ResponseEntity.ok(trainingProgramService.updateTrainingProgram(id, trainingProgram));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainingProgram(@PathVariable int id) {
        trainingProgramService.deleteTrainingProgram(id);
        return ResponseEntity.noContent().build();
    }

}
