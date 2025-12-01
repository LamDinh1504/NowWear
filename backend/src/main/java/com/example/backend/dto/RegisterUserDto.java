package com.example.backend.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class RegisterUserDto {
    private String email;
    private String phone;
    private String fullname;
    private String username;
    private String password;
}
