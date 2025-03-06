package com.complaint.controllers;

import com.complaint.entities.Response;
import com.complaint.services.IResponseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/responses")
@CrossOrigin(origins = "http://localhost:4200")
public class ResponseController {
    @Autowired
     IResponseService responseService;

    @GetMapping
    public ResponseEntity<List<Response>> getAllResponses() {
        return ResponseEntity.ok(responseService.getAllResponses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Response> getResponseById(@PathVariable Integer id) {
        Optional<Response> response = responseService.getResponseById(id);
        return response.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/complaint/{idcomplaint}")
    public ResponseEntity<List<Response>> getResponsesByComplaintId(@PathVariable Integer idcomplaint) {
        return ResponseEntity.ok(responseService.getResponsesByComplaintId(idcomplaint));
    }

    @PostMapping("/complaint/{idcomplaint}")
    public ResponseEntity<Response> createResponse(
            @PathVariable Integer idcomplaint,
            @RequestBody Response response) {
        Response newResponse = responseService.createResponse(idcomplaint, response);
        return newResponse != null ?
                ResponseEntity.status(HttpStatus.CREATED).body(newResponse) :
                ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Response> updateResponse(
            @PathVariable Integer id,
            @RequestBody Response responseDetails) {
        Response updatedResponse = responseService.updateResponse(id, responseDetails);
        return updatedResponse != null ?
                ResponseEntity.ok(updatedResponse) :
                ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResponse(@PathVariable Integer id) {
        return responseService.deleteResponse(id) ?
                ResponseEntity.ok().build() :
                ResponseEntity.notFound().build();
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<Response>> getResponsesByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return ResponseEntity.ok(responseService.getResponsesByDateRange(start, end));
    }

    @GetMapping("/recent")
    public ResponseEntity<List<Response>> getRecentResponses() {
        return ResponseEntity.ok(responseService.getRecentResponses());
    }

    @GetMapping("/count/complaint/{idcomplaint}")
    public ResponseEntity<Long> countResponsesForComplaint(@PathVariable Integer idcomplaint) {
        return ResponseEntity.ok(responseService.countByComplaintts_Idcomplaint(idcomplaint));
    }

    @GetMapping("/average-time")
    public ResponseEntity<Double> getAverageResponseTime() {
        return ResponseEntity.ok(responseService.getAverageResponseTime());
    }

    @GetMapping("/statistics")
    public ResponseEntity<Void> getStatistics() {
        responseService.statistiquesReponses();
        return ResponseEntity.ok().build();
    }
}
