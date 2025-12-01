package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name="product_images")
@Builder

public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="product_image_id")
    private int productImageId;

    @ManyToOne
    @JoinColumn(name="product_id")
    private Products product;

    @Column(name="url")
    private String url;

    @Column(name= "display_order")
    private int displayOrder;
}
