package com.example.backend.repository;

import com.example.backend.entity.CartItems;
import com.example.backend.entity.Carts;
import com.example.backend.entity.ProductInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource(path = "cart_items")
public interface CartItemRepository extends JpaRepository<CartItems, Integer> {
    Optional<CartItems> findByCartAndProductInventory(Carts cart, ProductInventory productInventoryId);
    List<CartItems> findByCart(Carts cart);
}
