package com.example.backend.controller;

import com.example.backend.entity.Revenue;
import com.example.backend.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/revenue")

public class RevenueController {
    @Autowired
    private RevenueService revenueService;

    @GetMapping
    public List<Revenue> getAllRevenue() {
        return revenueService.getAllRevenue();
    }
}
