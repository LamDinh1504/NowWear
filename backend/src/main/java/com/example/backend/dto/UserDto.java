package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class UserDto {
    private int userId;
    private String fullName;
    private String userName;
    private String email;
    private LocalDateTime createAt;
}
