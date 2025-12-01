package com.example.backend.repository;

import com.example.backend.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "roles")
public interface RoleRepository extends JpaRepository<Roles,Integer> {
    Roles findByRoleName(String roleName);
}
