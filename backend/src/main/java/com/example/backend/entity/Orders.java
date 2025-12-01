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
@Builder
@Table(name = "orders")
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private int orderId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users users;

    @OneToOne
    @JoinColumn(name = "address_id")
    private Addresses addresses;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "shipping_fee")
    private float shippingFee;

    @Column(name = "total_amount")
    private float totalAmount;

    @Column(name ="status")
    private String status;

    @Column(name = "payment_method")
    private String paymentMethod;

    @Column(name = "order_process")
    private String orderProcess;

    @OneToMany(mappedBy = "order")
    private List<OrderItems> orderItemList;

}
