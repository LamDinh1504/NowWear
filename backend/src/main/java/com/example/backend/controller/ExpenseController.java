package com.example.backend.controller;

import com.example.backend.entity.Expenses;
import com.example.backend.service.ExpenseService;
import com.example.backend.service.RevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expense")
public class ExpenseController {
    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private RevenueService revenueService;

    @GetMapping
    public List<Expenses> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @PostMapping
    public Expenses addExpense(@RequestBody Expenses expense) {
        Expenses savedExpense = expenseService.addExpense(expense);
        revenueService.updateOutcome(expense.getExpenseMonth(), expense.getExpenseYear());
        return savedExpense;
    }

    @PutMapping("/{id}")
    public Expenses updateExpense(@PathVariable int id, @RequestBody Expenses expense) {
        Expenses updatedExpense = expenseService.updateExpense(id, expense);
        revenueService.updateOutcome(expense.getExpenseMonth(), expense.getExpenseYear());
        return updatedExpense;
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable int id) {
        // Lấy thông tin tháng/năm trước khi xóa để cập nhật revenue
        Expenses expense = expenseService.getAllExpenses().stream()
                .filter(e -> e.getExpenseId() == id)
                .findFirst().orElse(null);
        if (expense != null) {
            expenseService.deleteExpense(id);
            revenueService.updateOutcome(expense.getExpenseMonth(), expense.getExpenseYear());
        }
    }
}
