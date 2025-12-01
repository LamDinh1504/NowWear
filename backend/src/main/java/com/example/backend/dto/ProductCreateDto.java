package com.example.backend.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder

public class ProductCreateDto {
    private String productName;
    private String productDescription;
    private int categoryId;
    private int subCategoryId;
    private float price;
    private List<ProductInventoryDto>  productInventory;
    private List<ProductImageDto> images;
}