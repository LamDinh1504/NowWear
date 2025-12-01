package com.example.backend.repository;

import com.example.backend.dto.OrderItemDto;
import com.example.backend.entity.CartItems;
import com.example.backend.entity.Carts;
import com.example.backend.entity.OrderItems;
import com.example.backend.entity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepository extends JpaRepository<OrderItems, Integer>
{
    List<OrderItems> findByOrder(Orders orders);
}
