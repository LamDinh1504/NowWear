package com.example.backend.security;

public class SecurityEndpoints {
    public static final String frontendURL = "http://localhost:5173";

    public static final String[] PUBLIC_GET_ENDPOINTS = {
            "/api/products",
            "/api/products/**",
            "/api/search",
            "/api/categories/**",
            "/api/subcategories/**",
            "/api/users",
            "/api/profile",
            "/api/orders",
            "/api/orders/**",
            "/api/revenue"
    };

    public static final String[] PUBLIC_POST_ENDPOINTS = {
            "/api/auth/register",
            "/api/auth/login",
            "/api/auth/forgot-password",  // thêm
            "/api/auth/reset-password",
            "/api/auth/verify-otp"
    };

    public static final String[] PUBLIC_PUT_ENDPOINTS = {
            "/api/profile",
            "/api/orders/{orderId}/update-process",
            "/api/orders/cancel/{orderId}"   // <-- thêm dòng này
    };

    public static final String[] ADMIN_GET_ENDPOINS = {
            "/api/products",
            "/api/users",
            "/api/users/**",
            "/api/expense",
            "/api/revenue"
    };

    public static final String[] ADMIN_POST_ENDPOINTS = {
            "/api/products",
            "/api/products/**",
            "/api/expense"
    };

    public static final String[] ADMIN_DELETE_ENDPOINTS = {
            "/api/products/**",
            "/api/products/",
            "/api/products/{productId}",
            "/api/expense/**",
            "/api/auth/delete/{username}",
    };

    public static final String[] ADMIN_PUT_ENDPOINTS = {
            "/api/products/**",
            "/api/products/",
            "/api/products/{productId}",
            "/api/expense/**"
    };
}
