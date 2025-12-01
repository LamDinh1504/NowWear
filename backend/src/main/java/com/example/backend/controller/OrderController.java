package com.example.backend.controller;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.dto.OrderRequestDto;
import com.example.backend.dto.OrderResponseDto;
import com.example.backend.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(){
        try{
            List<OrderDto> orderList = orderService.getOrders();
            return ResponseEntity.ok(orderList);
        }
        catch (Exception ex){
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserOrders() {
        try {
            // Lấy username từ SecurityContext
            String username = SecurityContextHolder.getContext().getAuthentication().getName();
            List<OrderResponseDto> orderList = orderService.getOrdersByUsername(username);
            return ResponseEntity.ok(orderList);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{orderId}/items")
    public ResponseEntity<?> getOrderItemsByOrderId(@PathVariable int orderId) {
        try {
            List<OrderItemDto> items = orderService.getOrderItemsByOrderId(orderId);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody OrderRequestDto orderRequestDTO) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            OrderResponseDto orderResponseDTO = orderService.createOrder(orderRequestDTO, username);
            return ResponseEntity.ok(orderResponseDTO);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/mark-paid")
    public ResponseEntity<?> markOrderPaid(@PathVariable int orderId) {
        try {
            OrderResponseDto updatedOrder = orderService.markPaid(orderId);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/mark-unpaid")
    public ResponseEntity<?> unMarkOrderPaid(@PathVariable int orderId) {
        try {
            OrderResponseDto updatedOrder = orderService.unMarkPaid(orderId);
            return ResponseEntity.ok(updatedOrder);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/cancel/{orderId}")
    public ResponseEntity<?> cancelOrder(@PathVariable int orderId) {
        try {
            // Lấy username từ token
            String username = SecurityContextHolder.getContext().getAuthentication().getName();

            String result = orderService.cancellOrders(orderId, username);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/{orderId}/update-process")
    public String updateProcess(
            @PathVariable int orderId,
            @RequestParam String process
    ) {
        return orderService.updateOrder(orderId, process);
    }
}
