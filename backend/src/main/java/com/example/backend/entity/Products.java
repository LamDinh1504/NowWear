package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "products")
@Builder

public class Products {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="product_id")
    private int productId;

    @Column(name = "product_name")
    private String productName;

    @Column(name ="product_description")
    private String productDescription;

    @ManyToOne
    @JoinColumn(name ="category_id")
    private Categories category;

    @ManyToOne
    @JoinColumn(name = "sub_category_id")
    private SubCategories subCategory;

    @Column(name ="price")
    private float price;

    @Column(name = "best_seller")
    private boolean bestSeller;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "product")
    private List<ProductImage> imageList;
}
