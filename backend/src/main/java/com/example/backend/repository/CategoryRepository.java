package com.example.backend.repository;

import com.example.backend.entity.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "categories")
public interface CategoryRepository extends JpaRepository<Categories, Integer> {
    Categories findByCategoryId(Integer  categoryId);
}
