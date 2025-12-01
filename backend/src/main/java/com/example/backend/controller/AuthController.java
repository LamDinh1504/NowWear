package com.example.backend.controller;

import com.example.backend.dto.LoginUserDto;
import com.example.backend.dto.RegisterUserDto;
import com.example.backend.service.AuthService;
import com.example.backend.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final PasswordResetService resetService;
    @Autowired
    private AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterUserDto registerUserDto) {
        String result = authService.registerUser(registerUserDto);
        if (result.equals("Đăng ký người dùng thành công!")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginUserDto loginUserDto) {
        try {
            String token = authService.loginUser(loginUserDto);
            return ResponseEntity.ok(Map.of("token", token));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        resetService.createPasswordResetToken(email);
        return ResponseEntity.ok("OTP đã được gửi vào email!");
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<Boolean> verifyOtp(@RequestBody Map<String, String> body) {
        String otp = body.get("otp");
        boolean valid = resetService.verifyOtp(otp);
        return ResponseEntity.ok(valid);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> body) {
        String otp = body.get("otp");
        String newPassword = body.get("newPassword");
        resetService.resetPassword(otp, newPassword);
        return ResponseEntity.ok("Mật khẩu đã được thay đổi!");
    }

    @DeleteMapping("/delete/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        try {
            String result = authService.deleteAuthService(username);

            if (result.equals("Xóa người dùng thành công")) {
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}
