package com.example.backend.repository;

import com.example.backend.dto.OrderDto;
import com.example.backend.entity.Orders;
import com.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.List;

@RepositoryRestResource(path = "orders")
public interface OrderRepository extends JpaRepository<Orders, Integer>
{
    List<Orders> findByUsers(Users user);
}
