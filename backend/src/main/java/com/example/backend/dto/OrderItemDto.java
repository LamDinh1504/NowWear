package com.example.backend.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class OrderItemDto {
    private int orderItemId;
    private String productName;
    private int quantity;
    private float price;
}
