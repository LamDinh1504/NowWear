package com.example.backend.dto;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class OrderRequestDto {
    private String city;
    private String district;
    private String street;
    private String paymentMethod;
    private String phone;
}
