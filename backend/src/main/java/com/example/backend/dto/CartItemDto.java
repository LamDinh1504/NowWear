package com.example.backend.dto;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class CartItemDto {
    private int productInventoryId;
    private String productName;
    private String productImageUrl;
    private int quantity;
    private float price;
}
