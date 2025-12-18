package com.askitracker.service;

import com.askitracker.entity.Outage;
import com.askitracker.entity.Subscription;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${app.frontend-url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${spring.mail.username:noreply@askitracker.com}")
    private String fromEmail;

    @Async
    public void sendConfirmationEmail(Subscription subscription) {
        try {
            Context context = new Context();
            context.setVariable("neighborhoodName", subscription.getNeighborhood().getName());
            context.setVariable("districtName", subscription.getNeighborhood().getDistrict().getName());
            context.setVariable("verificationUrl",
                    frontendUrl + "/verify?token=" + subscription.getVerificationToken());
            context.setVariable("unsubscribeUrl",
                    frontendUrl + "/unsubscribe?token=" + subscription.getUnsubscribeToken());

            String htmlContent = templateEngine.process("email/confirmation", context);

            sendHtmlEmail(
                    subscription.getEmail(),
                    "ASKİ Takip - Abonelik Onayı",
                    htmlContent);

            log.info("Sent confirmation email to: {}", subscription.getEmail());
        } catch (Exception e) {
            log.error("Failed to send confirmation email to: {}", subscription.getEmail(), e);
        }
    }

    @Async
    public void sendOutageNotification(Subscription subscription, Outage outage) {
        try {
            Context context = new Context();
            context.setVariable("outageTitle", outage.getTitle());
            context.setVariable("outageDescription", outage.getDescription());
            context.setVariable("startTime", outage.getStartTime());
            context.setVariable("endTime", outage.getEndTime());
            context.setVariable("neighborhoodName", subscription.getNeighborhood().getName());
            context.setVariable("districtName", subscription.getNeighborhood().getDistrict().getName());
            context.setVariable("sourceUrl", outage.getSourceUrl());
            context.setVariable("unsubscribeUrl",
                    frontendUrl + "/unsubscribe?token=" + subscription.getUnsubscribeToken());

            String htmlContent = templateEngine.process("email/outage-notification", context);

            sendHtmlEmail(
                    subscription.getEmail(),
                    "⚠️ ASKİ Su Kesintisi Bildirimi - " + subscription.getNeighborhood().getName(),
                    htmlContent);

            log.info("Sent outage notification to: {}", subscription.getEmail());
        } catch (Exception e) {
            log.error("Failed to send outage notification to: {}", subscription.getEmail(), e);
        }
    }

    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);
    }
}
