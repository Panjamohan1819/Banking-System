package com.banking.Banking_system.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        // --- For local testing: Print OTP to the backend console ---
        System.out.println("============================================");
        System.out.println("OTP for " + toEmail + " is: " + otp);
        System.out.println("============================================");
        // -----------------------------------------------------------

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("noreply@banking.com");
        message.setTo(toEmail);
        message.setSubject("Your Login OTP Code");
        message.setText("Your OTP for login is: " + otp + "\nIt will expire in 5 minutes.");
        try {
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}
