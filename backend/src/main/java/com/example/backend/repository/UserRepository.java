package com.example.backend.repository;

import com.example.backend.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import java.util.Optional;

@RepositoryRestResource(path = "users")
public interface UserRepository extends JpaRepository<Users, Integer> {
    boolean existsByUserName(String username);
    boolean existsByEmail(String email);
    Users findByUserName(String username);
    Optional<Users> findByEmail(String email);
}
