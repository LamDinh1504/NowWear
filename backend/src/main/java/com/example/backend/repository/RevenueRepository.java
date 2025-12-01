package com.example.backend.repository;

import com.example.backend.entity.Revenue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;


@RepositoryRestResource(path = "revenue")
public interface RevenueRepository extends JpaRepository<Revenue, Integer> {
    Optional<Revenue> findByRevenueMonthAndRevenueYear(int month, int year);
}
