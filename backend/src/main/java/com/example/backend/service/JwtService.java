package com.example.backend.service;

import com.example.backend.entity.Roles;
import com.example.backend.entity.Users;
import com.example.backend.repository.UserRepository;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.*;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final UserRepository userRepository;

    @Value("${jwt.secret:}") // Nếu không cấu hình sẽ tự sinh key
    private String secretKey;

    private Key signingKey;
    private SignatureAlgorithm algorithm;

    // Token có hiệu lực 100 giờ
    private static final long EXPIRATION_TIME_MS = 100 * 60 * 60 * 1000L;

    @PostConstruct
    public void init() {
        if (secretKey != null && !secretKey.isEmpty()) {
            byte[] keyBytes;
            try {
                keyBytes = Decoders.BASE64.decode(secretKey);
            } catch (Exception e) {
                // nếu không phải Base64, dùng UTF-8 bytes
                keyBytes = secretKey.getBytes();
            }

            if (keyBytes.length >= 64) { // ≥ 512 bits
                signingKey = Keys.hmacShaKeyFor(keyBytes);
                algorithm = SignatureAlgorithm.HS512;
            } else if (keyBytes.length >= 32) { // ≥ 256 bits
                signingKey = Keys.hmacShaKeyFor(Arrays.copyOf(keyBytes, 32)); // cắt/pad thành 32 bytes
                algorithm = SignatureAlgorithm.HS256;
                System.out.println("Warning: Key too short for HS512, fallback to HS256.");
            } else {
                // quá ngắn → sinh key mới 256 bits
                signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);
                algorithm = SignatureAlgorithm.HS256;
                System.out.println("Warning: Key too short, generated temporary HS256 key (dev only).");
            }

        } else {
            // Nếu không cấu hình key → sinh HS512 an toàn
            signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            algorithm = SignatureAlgorithm.HS512;
            System.out.println("Warning: No JWT secret configured. Using generated HS512 key (dev only).");
        }
    }

    private Key getSigningKey() {
        return signingKey;
    }

    /**
     * Tạo token JWT cho người dùng
     */
    public String generateToken(String username) {
        Users user = userRepository.findByUserName(username);
        if (user == null) {
            throw new RuntimeException("User không tồn tại!");
        }

        List<String> roles = user.getRoleSet().stream()
                .map(Roles::getRoleName)
                .toList();

        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles);
        claims.put("username", username);

        return buildToken(claims, username);
    }

    private String buildToken(Map<String, Object> claims, String subject) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME_MS);

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(getSigningKey(), algorithm)
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    @SuppressWarnings("unchecked")
    public List<String> extractRoles(String token) {
        Object rolesObj = extractAllClaims(token).get("roles");
        if (rolesObj instanceof List<?> list) {
            return list.stream().map(Object::toString).toList();
        }
        return Collections.emptyList();
    }

    public boolean isTokenValid(String token, String username) {
        String extractedUsername = extractUsername(token);
        return extractedUsername.equals(username) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractAllClaims(token).getExpiration().before(new Date());
    }
}


