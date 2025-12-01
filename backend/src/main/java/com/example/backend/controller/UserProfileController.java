package com.example.backend.controller;

import com.example.backend.dto.UserProfileDto;
import com.example.backend.entity.Users;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;

@RestController
@RequestMapping("/api/profile")
public class UserProfileController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public UserProfileDto getUserProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Users user = userRepository.findByUserName(username);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String createdAt = user.getCreateAt().format(formatter);
        UserProfileDto userDto = new UserProfileDto(
                user.getFullName(),
                user.getUserName(),
                user.getEmail(),
                user.getCreateAt()
        );
        return userDto;
    }

    @PutMapping
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileDto dto) {
        try {
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            Users user = userRepository.findByUserName(username);

            if(user == null) {
                return ResponseEntity.badRequest().body("Người dùng không tồn tại");
            }

            // Cập nhật thông tin
            user.setFullName(dto.getFullName());
            user.setEmail(dto.getEmail());

            userRepository.save(user);

            return ResponseEntity.ok("Cập nhật thông tin thành công!");
        } catch(Exception e) {
            return ResponseEntity.status(500).body("Lỗi server: " + e.getMessage());
        }
    }

}
