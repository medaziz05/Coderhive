package com.pi.trainingenrollment.service;

import com.pi.trainingenrollment.entities.Participant;
import com.pi.trainingenrollment.entities.User;
import com.pi.trainingenrollment.repository.ParticipantRepository;
import com.pi.trainingenrollment.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ParticipantService {

    private final ParticipantRepository participantRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    public List<Participant> getAllParticipants() {
        return participantRepository.findAll();
    }

    public Participant getParticipantById(int id) {
        return participantRepository.findById(id).orElse(null);
    }

    public Participant enrollParticipant(int userId, int trainingProgramId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec ID: " + userId));

        Participant participant = new Participant();
        participant.setUser(user);
        participant.setTrainingProgramId(trainingProgramId);
        participant.setStatus(Participant.Status.ENROLLED);

        Participant savedParticipant = participantRepository.save(participant);

        // ✅ Envoi de l'email après l'enregistrement
        sendConfirmationEmail(user, savedParticipant);

        return savedParticipant;
    }

    public Participant updateParticipantStatus(int id, Participant.Status status, double grade) {
        return participantRepository.findById(id).map(participant -> {
            participant.setStatus(status);
            if (status == Participant.Status.COMPLETED) {
                participant.setGrade(grade);
            }
            return participantRepository.save(participant);
        }).orElseThrow(() -> new RuntimeException("Participant non trouvé"));
    }

    public void deleteParticipant(int id) {
        participantRepository.deleteById(id);
    }

    private void sendConfirmationEmail(User user, Participant participant) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("📩 Confirmation d'inscription à une formation");

            String htmlContent = "<html>" +
                    "<body style='font-family: Arial, sans-serif;'>" +
                    "<h2 style='color: #2c3e50;'>Bonjour " + user.getUsername() + ",</h2>" +
                    "<p>👏 Vous avez été inscrit avec succès à la formation <strong>(ID: " + participant.getTrainingProgramId() + ")</strong>.</p>" +
                    "<p><strong>Statut :</strong> <span style='color: green;'>" + participant.getStatus() + "</span></p>" +
                    "<br/>" +
                    "<p>Merci de votre participation et à bientôt !</p>" +
                    "<hr/>" +
                    "<p style='font-size: 12px; color: #999;'>Cordialement,<br/>L'équipe Formation</p>" +
                    "</body></html>";

            helper.setText(htmlContent, true); // true => HTML

            mailSender.send(message);
            System.out.println("✅ Email de confirmation envoyé à " + user.getEmail());
        } catch (MessagingException e) {
            System.err.println("❌ Échec d'envoi de l'email: " + e.getMessage());
        }
    }
    public int calculateLearningScoreByUserId(int userId) {
        List<Participant> participations = participantRepository.findByUser_Id(userId);

        if (participations.isEmpty()) return 0;

        int totalScore = 0;
        int completed = 0;
        int cheated = 0;

        for (Participant p : participations) {
            if ("COMPLETED".equalsIgnoreCase(p.getStatus().toString())) {
                completed++;
                totalScore += p.getGrade();
            }
            if (p.isCheated()) {
                cheated++;
            }
        }

        int averageGrade = completed > 0 ? totalScore / completed : 0;

        int score = (int)((averageGrade * 0.6) + (completed * 10) - (cheated * 15));

        return Math.max(score, 0); // pas de score négatif
    }

    public Participant enrollParticipantWithDate(int userId, int trainingProgramId, LocalDate registrationDate) {
        Participant p = new Participant();
        p.setUser(userRepository.findById(userId).orElseThrow());
        p.setTrainingProgramId(trainingProgramId);
        p.setStatus(Participant.Status.valueOf("ENROLLED"));
        p.setGrade(0);
        p.setRegistrationDate(registrationDate);
        return participantRepository.save(p);
    }



}
