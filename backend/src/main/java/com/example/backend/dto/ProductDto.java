package com.example.backend.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder

public class ProductDto {
    private int productId;
    private String productName;
    private String productDescription;
    private float price;
    private boolean bestSeller;
    private LocalDateTime createdAt;
    private String productImageUrl;
    private String categoryName;
    private String subCategoryName;

    public String getProductImageUrl() {
        return "http://localhost:8080" + productImageUrl;
    }
}
