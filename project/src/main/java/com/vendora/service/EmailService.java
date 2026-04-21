package com.vendora.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendApprovalEmail(String to, String companyName, String email, String password) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Vendora - Supplier Account Approved");
        msg.setText(String.format(
            "Dear %s,\n\nYour supplier account has been approved.\n\nLogin credentials:\nEmail: %s\nPassword: %s\n\nPlease change your password after login.\n\nRegards,\nVendora Team",
            companyName, email, password
        ));
        mailSender.send(msg);
    }

    public void sendRejectionEmail(String to, String companyName) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject("Vendora - Supplier Registration Update");
        msg.setText(String.format(
            "Dear %s,\n\nWe regret to inform you that your supplier registration has been rejected.\n\nRegards,\nVendora Team",
            companyName
        ));
        mailSender.send(msg);
    }
}