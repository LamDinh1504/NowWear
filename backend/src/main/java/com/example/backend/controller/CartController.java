package com.example.backend.controller;

import com.example.backend.dto.CartItemDto;
import com.example.backend.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carts")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody Map<String, Integer> body
    ) {
        int productId = body.get("productInventoryId");
        int quantity = body.get("quantity");

        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            String result = cartService.addToCart(username, productId, quantity);
            return ResponseEntity.ok(result);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }

    }

    @DeleteMapping("/{productInventoryId}")
    public ResponseEntity<?> deleteFromCart(
            @PathVariable int productInventoryId
    ){
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        try{
            String result = cartService.removeFromCart(username, productInventoryId);
            return ResponseEntity.ok(result);
        }
        catch (Exception e){
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public List<CartItemDto> getCartItems() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        List<CartItemDto> cartItems = cartService.getCartItemsByUsername(username);
        return cartItems != null ? cartItems : List.of();
    }
}
