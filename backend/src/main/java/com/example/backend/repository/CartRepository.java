package com.example.backend.repository;

import com.example.backend.entity.Carts;
import com.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "carts")
public interface CartRepository extends JpaRepository<Carts, Integer> {
    Optional<Carts> findByUser(Users user);
}
