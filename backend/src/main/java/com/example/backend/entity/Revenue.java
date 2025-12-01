package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Table(name = "revenue")
@Builder

public class Revenue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "revenue_id")
    private int revenueId;

    @Column(name = "revenue_month")
    private int revenueMonth;

    @Column(name = "revenue_year")
    private int revenueYear;

    @Column(name = "income")
    private float income;

    @Column(name = "outcome")
    private float outcome;
}
