package com.pi.trainingenrollment.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendConfirmationEmail(String toEmail, String username, String trainingTitle) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(toEmail);
        helper.setSubject("🎉 Confirmation d'inscription à la formation");
        helper.setText(
                "<h3>Bonjour " + username + ",</h3>" +
                        "<p>Vous avez bien été inscrit(e) à la formation <strong>\"" + trainingTitle + "\"</strong>.</p>" +
                        "<p>Merci pour votre inscription, et à bientôt !</p><br>" +
                        "<p>L'équipe Formation 🚀</p>",
                true
        );

        mailSender.send(message);
    }
}
