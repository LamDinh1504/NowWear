package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name= "product_inventory")

public class ProductInventory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="product_inventory_id")
    private int productInventoryId;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Products product;

    @Column(name = "size")
    private String size;

    @Column(name ="stock_quantity")
    private int stockQuantity;


}
