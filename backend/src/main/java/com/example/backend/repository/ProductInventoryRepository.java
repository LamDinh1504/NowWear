package com.example.backend.repository;

import com.example.backend.entity.ProductInventory;
import com.example.backend.entity.Products;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "product_inventory")
public interface ProductInventoryRepository extends JpaRepository<ProductInventory, Integer> {
    List<ProductInventory> findByProduct_ProductId(Integer productId);
    ProductInventory  findByProductAndSize(Products product, String size);
    ProductInventory findByProductInventoryId(Integer productInventoryId);
}
