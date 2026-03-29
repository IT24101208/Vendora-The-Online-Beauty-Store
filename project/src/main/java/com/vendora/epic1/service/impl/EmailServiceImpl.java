package com.vendora.epic1.service.impl;

import com.vendora.epic1.service.EmailService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailServiceImpl.class);

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);
        } catch (MessagingException | MailException e) {
            log.warn("Failed to send email to {}: {}", to, e.getMessage());
        }
    }

    @Override
    public void sendVerificationEmail(String to, String token) {
        String subject = "Verify Your Email";
        String body = """
                <html>
                    <body>
                        <h2>Email Verification</h2>
                        <p>Please verify your email using the token below:</p>
                        <p><b>%s</b></p>
                    </body>
                </html>
                """.formatted(token);

        sendEmail(to, subject, body);
    }

    @Override
    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Reset Your Password";
        String body = """
                <html>
                    <body>
                        <h2>Password Reset</h2>
                        <p>Use the token below to reset your password:</p>
                        <p><b>%s</b></p>
                    </body>
                </html>
                """.formatted(token);

        sendEmail(to, subject, body);
    }
}