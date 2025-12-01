package com.example.backend.service;

import com.example.backend.entity.PasswordResetTokens;
import com.example.backend.entity.Users;
import com.example.backend.repository.PasswordResetTokenRepository;
import com.example.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final EmailService emailService;

    public void createPasswordResetToken(String email) {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Tạo OTP ngẫu nhiên 6 chữ số
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        PasswordResetTokens resetToken = new PasswordResetTokens();
        resetToken.setUserId(user);
        resetToken.setToken(otp); // lưu OTP
        resetToken.setExpiration(LocalDateTime.now().plusMinutes(10)); // 10 phút
        resetToken.setUsed(false);
        tokenRepository.save(resetToken);

        // Gửi email với OTP
        emailService.sendResetPasswordEmail(email, "Mã OTP của bạn là: " + otp + " (hết hạn trong 10 phút)");
    }

    public boolean verifyOtp(String token) {
        PasswordResetTokens resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("OTP không hợp lệ"));

        if (resetToken.isUsed()) return false;
        if (resetToken.getExpiration().isBefore(LocalDateTime.now())) return false;

        return true;
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetTokens resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("OTP không hợp lệ"));

        if (resetToken.isUsed()) throw new RuntimeException("OTP đã được sử dụng");
        if (resetToken.getExpiration().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP đã hết hạn");

        Users user = resetToken.getUserId();
        user.setPasswordHash(new BCryptPasswordEncoder().encode(newPassword));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
