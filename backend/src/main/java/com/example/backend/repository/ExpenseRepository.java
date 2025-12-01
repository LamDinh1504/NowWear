package com.example.backend.repository;

import com.example.backend.entity.Expenses;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expenses, Integer> {
    List<Expenses> findByExpenseMonthAndExpenseYear(int month, int year);
    Expenses findByDescription(String  description);
    List<Expenses> findAllByDescription(String description);
}
