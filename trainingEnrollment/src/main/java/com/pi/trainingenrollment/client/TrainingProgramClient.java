// src/main/java/com/pi/trainingenrollment/client/TrainingProgramClient.java

package com.pi.trainingenrollment.client;

import com.pi.trainingenrollment.model.TrainingProgram;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TrainingProgramClient {

    private final RestTemplate restTemplate;

    public TrainingProgramClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public TrainingProgram getTrainingProgramById(int id) {
        String url = "http://trainingprogram-service/api/v1/formation/" + id;
        return restTemplate.getForObject(url, TrainingProgram.class);
    }
}
