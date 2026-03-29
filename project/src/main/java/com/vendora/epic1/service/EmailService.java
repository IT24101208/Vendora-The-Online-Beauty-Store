package com.vendora.epic1.service;

public interface EmailService {

    void sendEmail(String to, String subject, String body);

    void sendVerificationEmail(String to, String token);

    void sendPasswordResetEmail(String to, String token);
}