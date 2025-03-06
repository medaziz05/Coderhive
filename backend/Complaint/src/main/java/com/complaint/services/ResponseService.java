package com.complaint.services;

import com.complaint.entities.Complaintts;
import com.complaint.entities.Response;
import com.complaint.entities.StatusCom;
import com.complaint.repositories.ComplaintRepository;
import com.complaint.repositories.ResponseRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@Slf4j
@Service
public class ResponseService implements IResponseService{
    @Autowired
    private ResponseRepository responseRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private ComplaintRepository complaintRepository;
    @Override
    public List<Response> getAllResponses() {
        List<Response> responses = new ArrayList<>();
        responseRepository.findAll().forEach(responses::add);
        return  responses;
    }

    @Override
    public Optional<Response> getResponseById(Integer id) {
        return responseRepository.findById(id);
    }

    @Override
    public List<Response> getResponsesByComplaintId(Integer idcomplaint) {
        return responseRepository.findByComplaintts_Idcomplaint(idcomplaint);
    }

    @Override
    public Response createResponse(Integer idcomplaint, Response response) {
        return complaintRepository.findById(idcomplaint).map(complaint -> {
            response.setComplaintts(complaint);
            // Ensure the date is set
            if (response.getDate() == null) {
                response.setDate(LocalDateTime.now());
            }
            // Mark the complaint as solved after response
            complaint.setStatus(StatusCom.SOLVED);
            complaintRepository.save(complaint);

            // Save the response
            Response savedResponse = responseRepository.save(response);

            // Send the email notification
            sendResponseEmail(complaint, savedResponse);

            return savedResponse;
        }).orElse(null);
    }

    private void sendResponseEmail(Complaintts complaint, Response response) {
        try {
            String userEmail = complaint.getMail(); // Get email from Complaint

            if (userEmail == null || userEmail.isEmpty()) {
                log.warn("No email found for complaint ID: {}", complaint.getIdcomplaint());
                return;
            }

            String subject = "Response to Your Complaint: " + complaint.getTitle();
            String body = String.format(
                    "Dear User,\n\n" +
                            "We have responded to your complaint:\n\n" +
                            "**Complaint Title**: %s\n" +
                            "**Your Message**: %s\n\n" +
                            "**Our Response**: %s\n\n" +
                            "Thank you for your feedback.\n\n" +
                            "Best regards,\nThe Support Team",
                    complaint.getTitle(),
                    complaint.getDescription(),
                    response.getMessage()
            );

            emailService.sendEmail(userEmail, subject, body);
            log.info("Notification sent to: {}", userEmail);

        } catch (Exception e) {
            log.error("Failed to send email for complaint ID {}: {}",
                    complaint.getIdcomplaint(), e.getMessage());
        }
    }

    @Override
    public Response updateResponse(Integer id, Response responseDetails) {
        Optional<Response> responseOpt = responseRepository.findById(id);
        if (responseOpt.isPresent()) {
            Response response = responseOpt.get();
            response.setMessage(responseDetails.getMessage());
            // Ne pas modifier la date de création lors de la mise à jour
            return responseRepository.save(response);
        }
        return null;
    }

    @Override
    public boolean deleteResponse(Integer id) {
        if (responseRepository.existsById(id)) {
            responseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Response> getResponsesByDateRange(LocalDateTime start, LocalDateTime end) {
        return  responseRepository.findByDateBetween(start, end);
    }

    @Override
    public List<Response> getRecentResponses() {
        return responseRepository.findAllByOrderByDateDesc();
    }

    @Override
    public long countByComplaintts_Idcomplaint(Integer idcomplaint) {
        return  responseRepository.countByComplaintts_Idcomplaint(idcomplaint);
    }

    @Override
    public double getAverageResponseTime() {
        List<Complaintts> solvedComplaints = complaintRepository.findByStatus(StatusCom.SOLVED);
        if (solvedComplaints.isEmpty()) {
            return 0;
    }
        double totalHours = 0;
        int count = 0;

        for (Complaintts complaint : solvedComplaints) {
            List<Response> responses = responseRepository.findByComplaintts_Idcomplaint(complaint.getIdcomplaint());
            if (!responses.isEmpty()) {
                // Prendre la première réponse pour calculer le temps de réponse
                Response firstResponse = responses.get(0);
                Duration duration = Duration.between(complaint.getDate(), firstResponse.getDate());
                totalHours += duration.toHours();
                count++;
            }
        }

        return count > 0 ? totalHours / count : 0;
    }

    @Override
    public void statistiquesReponses() {
        System.out.println("=== STATISTIQUES DES RÉPONSES ===");

        // Nombre total de réponses
        long totalResponses = 0;
        Iterable<Response> allResponses = responseRepository.findAll();
        for (Response response : allResponses) {
            totalResponses++;
        }
        System.out.println("Nombre total de réponses: " + totalResponses);

        // Temps moyen de réponse
        double avgResponseTime = getAverageResponseTime();
        System.out.println("Temps moyen de réponse: " + String.format("%.2f", avgResponseTime) + " heures");

        // Nombre de plaintes sans réponse
        long pendingComplaints = complaintRepository.countByStatus(StatusCom.PENDING);
        System.out.println("Plaintes en attente de réponse: " + pendingComplaints);

        // Taux de réponse
        long totalComplaints = complaintRepository.count();
        double responseRate = totalComplaints > 0 ?
                (double) (totalComplaints - pendingComplaints) / totalComplaints * 100 : 0;
        System.out.println("Taux de réponse: " + String.format("%.2f", responseRate) + "%");

    }
}
