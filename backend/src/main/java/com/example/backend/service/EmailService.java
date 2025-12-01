package com.example.backend.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetPasswordEmail(String toEmail, String token) {
        String resetLink = "http://localhost:5173/reset-password?token=" + token; // link frontend
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu");
        message.setText("Nhấn vào link sau để đặt lại mật khẩu: " + resetLink);
        mailSender.send(message);
    }
}
