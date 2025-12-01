package com.example.backend.controller;

import com.example.backend.dto.OrderItemDto;
import com.example.backend.dto.ProductCreateDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductInventoryDto;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;

    // Lấy tất cả sản phẩm
    @GetMapping("/products")
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> products = productService.getAllProduct();
        return ResponseEntity.ok(products);
    }

    // Lấy sản phẩm theo ID
    @GetMapping("/products/{productId}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable int productId) {
        try {
            ProductDto product = productService.getProductById(productId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Lấy sản phẩm theo Category slug (men/women/kids)
    @GetMapping("/categories/{categorySlug}/products")
    public ResponseEntity<List<ProductDto>> getProductsByCategorySlug(@PathVariable String categorySlug) {
        int categoryId;
        switch (categorySlug.toLowerCase()) {
            case "men":
                categoryId = 1;
                break;
            case "women":
                categoryId = 2;
                break;
            case "kids":
                categoryId = 3;
                break;
            default:
                return ResponseEntity.badRequest().build();
        }
        List<ProductDto> products = productService.getProductByCategories(categoryId);
        return ResponseEntity.ok(products);
    }

    // Lấy sản phẩm theo SubCategory slug (topwear/bottomwear/winterwear)
    @GetMapping("/subcategories/{typeSlug}/products")
    public ResponseEntity<List<ProductDto>> getProductsBySubCategorySlug(@PathVariable String typeSlug) {
        int subCategoryId;
        switch (typeSlug.toLowerCase()) {
            case "topwear":
                subCategoryId = 1;
                break;
            case "bottomwear":
                subCategoryId = 2;
                break;
            case "winterwear":
                subCategoryId = 3;
                break;
            default:
                return ResponseEntity.badRequest().build();
        }
        List<ProductDto> products = productService.getProductBySubCategories(subCategoryId);
        return ResponseEntity.ok(products);
    }

    // Tìm kiếm sản phẩm theo keyword
    @GetMapping("/products/search")
    public ResponseEntity<List<ProductDto>> searchProducts(@RequestParam String keyword) {
        List<ProductDto> products = productService.searchProductByKeyword(keyword);
        return ResponseEntity.ok(products);
    }

    // Lấy inventory của sản phẩm
    @GetMapping("/products/{productId}/inventory")
    public ResponseEntity<List<ProductInventoryDto>> getProductInventory(@PathVariable int productId) {
        List<ProductInventoryDto> inventory = productService.getProductInventoryByProductId(productId);
        return ResponseEntity.ok(inventory);
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProduct(@RequestBody ProductCreateDto dto) {
        String result = productService.createProduct(dto);
        return ResponseEntity.ok(result);
    }

    // Cập nhật sản phẩm
    @PutMapping("/products/{productId}")
    public ResponseEntity<String> updateProduct(@PathVariable int productId, @RequestBody ProductCreateDto productCreateDto) {
        String result = productService.updateProductById(productId, productCreateDto);
        if (result.contains("thành công")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }

    // Xóa sản phẩm
    @DeleteMapping("/products/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable int productId) {
        String result = productService.deleteProductById(productId);
        if (result.contains("thành công")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.badRequest().body(result);
        }
    }
}
