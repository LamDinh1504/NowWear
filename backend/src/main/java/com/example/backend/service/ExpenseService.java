package com.example.backend.service;

import com.example.backend.entity.Expenses;
import com.example.backend.repository.ExpenseRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private RevenueService revenueService;

    public List<Expenses> getAllExpenses() {
        return expenseRepository.findAll();
    }

    @Transactional
    public Expenses addExpense(Expenses expense) {
        Expenses savedExpense = expenseRepository.save(expense);
        revenueService.updateOutcome(expense.getExpenseMonth(), expense.getExpenseYear());
        return savedExpense;
    }

    @Transactional
    public Expenses updateExpense(int id, Expenses expense) {
        expense.setExpenseId(id);
        Expenses updatedExpense = expenseRepository.save(expense);
        revenueService.updateOutcome(expense.getExpenseMonth(), expense.getExpenseYear());
        return updatedExpense;
    }

    @Transactional
    public void deleteExpense(int id) {
        Expenses expense = expenseRepository.findById(id).orElse(null);
        if (expense != null) {
            int month = expense.getExpenseMonth();
            int year = expense.getExpenseYear();
            expenseRepository.deleteById(id);
            revenueService.updateOutcome(month, year);
        }
    }
}
