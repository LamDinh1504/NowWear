package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "password_reset_tokens")
@Builder

public class PasswordResetTokens {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users userId;

    @Column(name = "token")
    private String token;

    @Column(name = "expiration")
    private LocalDateTime expiration;

    @Column(name = "used")
    private boolean used;
}
