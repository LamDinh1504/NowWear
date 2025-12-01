package com.example.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "addresses")

public class Addresses {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private int addressId;

    @Column(name = "city")
    private String city;

    @Column(name ="district")
    private String district;

    @Column(name ="street")
    private String street;

    @Column(name ="phone")
    private String phone;

    @OneToMany(mappedBy = "addresses")
    private List<Orders> orderList;
}
