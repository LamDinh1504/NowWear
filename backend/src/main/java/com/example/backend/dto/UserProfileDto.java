package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileDto {
    private String fullName;
    private String username;
    private String email;
    private LocalDateTime createdAt;
}
