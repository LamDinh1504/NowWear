package com.example.backend.security;

import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import java.io.IOException;
import jakarta.servlet.ServletException;

/**
 * (Đã vô hiệu hóa Google OAuth2)
 * Giữ class trống để tránh lỗi nếu bị @Bean hoặc cấu hình import tới.
 */
@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {
        // Không làm gì cả (Google OAuth2 đã bị tắt)
        response.sendError(HttpServletResponse.SC_FORBIDDEN, "OAuth2 login is disabled.");
    }
}
