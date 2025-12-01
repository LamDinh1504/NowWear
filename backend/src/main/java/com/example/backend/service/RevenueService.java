package com.example.backend.service;

import com.example.backend.entity.Expenses;
import com.example.backend.entity.Revenue;
import com.example.backend.repository.ExpenseRepository;
import com.example.backend.repository.RevenueRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RevenueService {
    @Autowired
    private RevenueRepository revenueRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    // Tăng income khi đơn hàng paid
    @Transactional
    public void addIncome(float amount, LocalDateTime date) {
        int month = date.getMonthValue();
        int year = date.getYear();
        Revenue revenue = revenueRepository.findByRevenueMonthAndRevenueYear(month, year)
                .orElse(Revenue.builder()
                        .revenueMonth(month)
                        .revenueYear(year)
                        .income(0)
                        .outcome(0)
                        .build());
        revenue.setIncome((revenue.getIncome() + amount));
        revenueRepository.save(revenue);
    }

    @Transactional
    public void subtractIncome(double amount, LocalDateTime date) {
        int month = date.getMonthValue();
        int year = date.getYear();
        Revenue revenue = revenueRepository.findByRevenueMonthAndRevenueYear(month, year)
                .orElse(null);
        if (revenue != null) {
            revenue.setIncome((float)Math.max(0, revenue.getIncome() - amount));
            revenueRepository.save(revenue);
        }
    }

    // Cập nhật outcome khi thêm/sửa/xóa expense
    @Transactional
    public void updateOutcome(int month, int year) {
        List<Expenses> expenses = expenseRepository.findByExpenseMonthAndExpenseYear(month, year);
        float totalOutcome = (float) expenses.stream().mapToDouble(Expenses::getExpenseAmount).sum();
        Revenue revenue = revenueRepository.findByRevenueMonthAndRevenueYear(month, year)
                .orElse(Revenue.builder()
                        .revenueMonth(month)
                        .revenueYear(year)
                        .income(0)
                        .outcome(0)
                        .build());

        revenue.setOutcome(totalOutcome);
        revenueRepository.save(revenue);
    }

    // API lấy danh sách revenue (cho frontend)
    public List<Revenue> getAllRevenue() {
        return revenueRepository.findAll();
    }
}
