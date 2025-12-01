package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class OrderDto {
    private int orderId;
    private String fullName;
    private String userName;
    private String email;
    private String phone;
    private String city;
    private String district;
    private String street;
    private LocalDateTime createdAt;
    private String paymentMethod;
    private String status;
    private String orderProcess;
    private List<OrderItemDto> orderItemList;
    private float totalAmount;
}
