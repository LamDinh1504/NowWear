package com.example.backend.repository;

import com.example.backend.entity.PasswordResetTokens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetTokens, Integer> {
    Optional<PasswordResetTokens> findByToken(String token);
}
