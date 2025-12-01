package com.example.backend.dto;

import jakarta.persistence.Column;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductInventoryDto {
    private int productInventoryId;
    private String size;
    private int stockQuantity;
}
