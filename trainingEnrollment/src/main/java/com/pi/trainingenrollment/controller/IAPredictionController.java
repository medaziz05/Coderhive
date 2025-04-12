package com.pi.trainingenrollment.controller;

import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
@CrossOrigin("*")
public class IAPredictionController {

    private final String FLASK_API_URL = "http://localhost:5000/predict"; // Flask doit tourner sur ce port

    @PostMapping("/predict-dropout")
    public boolean predictDropoutRisk(@RequestBody Map<String, Object> payload) {
        RestTemplate restTemplate = new RestTemplate();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(FLASK_API_URL, requestEntity, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return (Boolean) response.getBody().get("risk");
            }
        } catch (Exception e) {
            System.err.println("Erreur appel Flask : " + e.getMessage());
        }

        return false;
    }
}
