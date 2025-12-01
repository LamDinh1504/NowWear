package com.example.backend.repository;

import com.example.backend.entity.SubCategories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "sub_categories")
public interface SubCategoryRepository extends JpaRepository<SubCategories, Integer> {
    SubCategories  findBySubCategoryId(Integer subCategoryId);
}
