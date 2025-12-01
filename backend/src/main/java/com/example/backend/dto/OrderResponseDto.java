package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class OrderResponseDto {
    private int orderId;
    private float shippingFee;
    private float totalAmount;
    private String status;
    private String paymentMethod;
    private String orderProcess;
    private LocalDateTime createdAt;
}
