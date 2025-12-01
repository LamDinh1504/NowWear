//package com.example.backend.service;
//
//import com.example.backend.dto.ProductDto;
//import com.example.backend.repository.ProductImageRepository;
//import com.example.backend.repository.ProductInventoryRepository;
//import com.example.backend.repository.ProductRepository;
//import com.example.backend.repository.SubCategoryRepository;
//import jakarta.persistence.EntityManager;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class ProductService {
//
//    @Autowired
//    private EntityManager entityManager;
//
//    @Autowired
//    private ProductImageRepository productImageRepository;
//
//    @Autowired
//    private ProductRepository productRepository;
//
//    @Autowired
//    private ProductInventoryRepository productInventoryRepository;
//
//    @Autowired
//    private SubCategoryRepository subCategoryRepository;
//
//    public List<ProductDto> getAllProduct() {
//        String query = "SELECT new com.example.backend.dto.ProductDto(p.productId, p.productName, p.productDescription, p.price, p.bestSeller, pi.url) " +
//                "FROM Products p LEFT JOIN ProductImage pi ON pi.product.productId = p.productId " +
//                "AND pi.displayOrder=1";
//        return entityManager.createQuery(query, ProductDto.class).getResultList();
//    }
//
//    public ProductDto getProductById(int productId) {
//        String query = "SELECT new com.example.backend.dto.ProductDto(p.productId, p.productName, p.productDescription, p.price, p.bestSeller, pi.url) " +
//                "FROM Products p LEFT JOIN ProductImage pi ON pi.product.productId = p.productId " +
//                "WHERE p.productId = :productId AND pi.displayOrder = 1";
//        return entityManager.createQuery(query, ProductDto.class)
//                .setParameter("productId", productId)
//                .getSingleResult();
//    }
//
//    public List<ProductDto> getProductByCategories(int categoryId) {
//        String query = "SELECT new com.example.backend.dto.ProductDto(p.productId, p.productName, p.productDescription, p.price, p.bestSeller, pi.url) " +
//                "FROM Products p " +
//                "JOIN ProductImage pi ON pi.product.productId=p.productId " +
//                "JOIN Categories c ON p.category.categoryId=c.categoryId " +
//                "WHERE c.categoryId=:categoryId AND pi.displayOrder=1";
//        return entityManager.createQuery(query, ProductDto.class)
//                .setParameter("categoryId", categoryId)
//                .getResultList();
//    }
//
//    public List<ProductDto> getProductBySubCategories(int subCategoryId) {
//        String query = "SELECT new com.example.backend.dto.ProductDto(p.productId, p.productName, p.productDescription, p.price, p.bestSeller, pi.url) " +
//                "FROM Products p " +
//                "JOIN ProductImage pi ON pi.product.productId=p.productId " +
//                "JOIN SubCategories s ON p.subCategory.subCategoryId=s.subCategoryId " +
//                "WHERE s.subCategoryId=:subCategoryId AND pi.displayOrder=1";
//        return entityManager.createQuery(query, ProductDto.class)
//                .setParameter("subCategoryId", subCategoryId)
//                .getResultList();
//    }
//
//    public List<ProductDto> searchProductByKeyword(String keyword) {
//        String query = "SELECT new com.example.backend.dto.ProductDto(" +
//                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, pi.url) " +
//                "FROM Products p " +
//                "LEFT JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
//                "WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
//                "OR LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))";
//
//        return entityManager.createQuery(query, ProductDto.class)
//                .setParameter("keyword", keyword)
//                .getResultList();
//    }
//}


package com.example.backend.service;

import com.example.backend.dto.ProductCreateDto;
import com.example.backend.dto.ProductDto;
import com.example.backend.dto.ProductImageDto;
import com.example.backend.dto.ProductInventoryDto;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
public class ProductService {

    @Autowired
    private EntityManager entityManager;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductInventoryRepository productInventoryRepository;

    @Autowired
    private SubCategoryRepository subCategoryRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ExpenseRepository expensesRepository;

    @Autowired
    private ExpenseService expenseService;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private RevenueService revenueService;

    // Lấy tất cả sản phẩm
    public List<ProductDto> getAllProduct() {
        String query = "SELECT new com.example.backend.dto.ProductDto(" +
                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, p.createdAt, pi.url, " +
                "c.categoryName, s.subCategoryName) " +
                "FROM Products p " +
                "JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
                "JOIN Categories c ON p.category.categoryId = c.categoryId " +
                "JOIN SubCategories s ON p.subCategory.subCategoryId = s.subCategoryId";
        return entityManager.createQuery(query, ProductDto.class).getResultList();
    }

    // Lấy sản phẩm theo ID
    public ProductDto getProductById(int productId) {
        String query = "SELECT new com.example.backend.dto.ProductDto(" +
                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, p.createdAt, pi.url, " +
                "c.categoryName, s.subCategoryName) " +
                "FROM Products p " +
                "JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
                "JOIN Categories c ON p.category.categoryId = c.categoryId " +
                "JOIN SubCategories s ON p.subCategory.subCategoryId = s.subCategoryId " +
                "WHERE p.productId = :productId";
        return entityManager.createQuery(query, ProductDto.class)
                .setParameter("productId", productId)
                .getSingleResult();
    }

    // Lấy sản phẩm theo Category
    public List<ProductDto> getProductByCategories(int categoryId) {
        String query = "SELECT new com.example.backend.dto.ProductDto(" +
                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, p.createdAt, pi.url, " +
                "c.categoryName, s.subCategoryName) " +
                "FROM Products p " +
                "JOIN Categories c ON p.category.categoryId = c.categoryId " +
                "JOIN SubCategories s ON p.subCategory.subCategoryId = s.subCategoryId " +
                "JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
                "WHERE c.categoryId = :categoryId";
        return entityManager.createQuery(query, ProductDto.class)
                .setParameter("categoryId", categoryId)
                .getResultList();
    }

    // Lấy sản phẩm theo SubCategory
    public List<ProductDto> getProductBySubCategories(int subCategoryId) {
        String query = "SELECT new com.example.backend.dto.ProductDto(" +
                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, p.createdAt, pi.url, " +
                "c.categoryName, s.subCategoryName) " +
                "FROM Products p " +
                "JOIN SubCategories s ON p.subCategory.subCategoryId = s.subCategoryId " +
                "JOIN Categories c ON p.category.categoryId = c.categoryId " +
                "JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
                "WHERE s.subCategoryId = :subCategoryId";
        return entityManager.createQuery(query, ProductDto.class)
                .setParameter("subCategoryId", subCategoryId)
                .getResultList();
    }

    // Tìm kiếm sản phẩm theo keyword
    public List<ProductDto> searchProductByKeyword(String keyword) {
        String query = "SELECT new com.example.backend.dto.ProductDto(" +
                "p.productId, p.productName, p.productDescription, p.price, p.bestSeller, p.createdAt, pi.url, " +
                "c.categoryName, s.subCategoryName) " +
                "FROM Products p " +
                "JOIN ProductImage pi ON pi.product.productId = p.productId AND pi.displayOrder = 1 " +
                "JOIN Categories c ON p.category.categoryId = c.categoryId " +
                "JOIN SubCategories s ON p.subCategory.subCategoryId = s.subCategoryId " +
                "WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
                "OR LOWER(p.productDescription) LIKE LOWER(CONCAT('%', :keyword, '%'))";
        return entityManager.createQuery(query, ProductDto.class)
                .setParameter("keyword", keyword)
                .getResultList();
    }

    public List<ProductInventoryDto> getProductInventoryByProductId(int productId) {
        String query = "SELECT new com.example.backend.dto.ProductInventoryDto(" +
                "pi.productInventoryId, pi.size, pi.stockQuantity) " +
                "FROM ProductInventory pi " +
                "WHERE pi.product.productId = :productId";

        return entityManager.createQuery(query, ProductInventoryDto.class)
                .setParameter("productId", productId)
                .getResultList();
    }

    @Transactional
    public String createProduct(ProductCreateDto productCreateDto) {

        // Validate category
        Categories category = categoryRepository.findByCategoryId(productCreateDto.getCategoryId());
        if (category == null) return "Không thể tìm thấy thể loại";

        // Validate sub-category
        SubCategories subCategory = subCategoryRepository.findBySubCategoryId(productCreateDto.getSubCategoryId());
        if (subCategory == null) return "Không tìm thấy thể loại con";

        // Tạo product
        Products product = new Products();
        product.setProductName(productCreateDto.getProductName());
        product.setProductDescription(productCreateDto.getProductDescription());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setPrice(productCreateDto.getPrice());
        product.setBestSeller(false);
        product.setCreatedAt(LocalDateTime.now());

        productRepository.save(product);

        if(productCreateDto.getImages() !=null) {
            for (ProductImageDto productImageDto : productCreateDto.getImages()) {
                ProductImage  productImageDto1 = new ProductImage();
                productImageDto1.setProduct(product);
                productImageDto1.setUrl(productImageDto.getUrl());
                productImageDto1.setDisplayOrder(productImageDto.getDisplayOrder());
                productImageRepository.save(productImageDto1);
            }
        }

        float sumPrice=0;

        // Lưu inventory nếu có
        if (productCreateDto.getProductInventory() != null) {
            for (ProductInventoryDto invDto : productCreateDto.getProductInventory()) {
                ProductInventory inv = new ProductInventory();
                inv.setProduct(product);
                inv.setSize(invDto.getSize());
                inv.setStockQuantity(invDto.getStockQuantity());
                sumPrice += product.getPrice() * invDto.getStockQuantity();
                productInventoryRepository.save(inv);

            }
        }

        Expenses  expenses = new Expenses();
        expenses.setExpenseMonth(product.getCreatedAt().getMonthValue());
        expenses.setExpenseYear(product.getCreatedAt().getYear());
        expenses.setExpenseAmount(sumPrice);
        expenses.setDescription("Nhập hàng: " + product.getProductName());
        expenses.setCreatedAt(LocalDateTime.now());
        expenseService.addExpense(expenses);

        return "Thêm sản phẩm thành công";
    }

    @Transactional
    public String deleteProductById(int productId) {
        Products product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Không tìm thấy sản phẩm";
        }

        productInventoryRepository.deleteAll(
                productInventoryRepository.findByProduct_ProductId(productId)
        );

        productImageRepository.deleteAll(
                productImageRepository.findByProduct_ProductId(productId)
        );

//        Expenses expenses = expenseRepository.findByDescription(
//                "Nhập hàng: " + product.getProductName()
//        );
//
//        if (expenses != null) {
//            int month = expenses.getExpenseMonth();
//            int year = expenses.getExpenseYear();
//            expenseService.deleteExpense(expenses.getExpenseId());
//        }
        List<Expenses> expensesList =
                expenseRepository.findAllByDescription("Nhập hàng: " + product.getProductName());

        for (Expenses exp : expensesList) {
            expenseService.deleteExpense(exp.getExpenseId());
        }


        productRepository.delete(product);
        return "Xóa sản phẩm thành công";
    }



    @Transactional
    public String updateProductById(int productId, ProductCreateDto productCreateDto) {
        Products product = productRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Không tìm thấy sản phẩm, vui lòng thử lại";
        }

        Categories category = categoryRepository.findByCategoryId(productCreateDto.getCategoryId());
        if (category == null) return "Không thể tìm thấy thể loại";

        // Validate sub-category
        SubCategories subCategory = subCategoryRepository.findBySubCategoryId(productCreateDto.getSubCategoryId());
        if (subCategory == null) return "Không tìm thấy thể loại con";

        // Cập nhật thông tin cơ bản
        product.setProductName(productCreateDto.getProductName());

        product.setProductDescription(productCreateDto.getProductDescription());
        product.setCategory(category);
        product.setSubCategory(subCategory);
        product.setPrice(productCreateDto.getPrice());
        productRepository.save(product);
        float totalCostAdjustment = 0; // Tổng số tiền điều chỉnh

        // Cập nhật tồn kho + tính chênh lệch chi phí
        if (productCreateDto.getProductInventory() != null) {

            for (ProductInventoryDto dto : productCreateDto.getProductInventory()) {

                ProductInventory existingInventory =
                        productInventoryRepository.findByProductAndSize(product, dto.getSize());

                if (existingInventory != null) {

                    int oldQty = existingInventory.getStockQuantity();
                    int newQty = dto.getStockQuantity();
                    int diff = newQty - oldQty;  // + tăng, - giảm

                    // Tính chênh lệch chi phí
                    if (diff != 0) {
                        totalCostAdjustment += diff * product.getPrice();
                    }

                    // Cập nhật tồn kho
                    existingInventory.setStockQuantity(newQty);
                    productInventoryRepository.save(existingInventory);

                } else {
                    // Size mới -> toàn bộ là nhập thêm
                    totalCostAdjustment += dto.getStockQuantity() * product.getPrice();

                    ProductInventory newInventory = new ProductInventory();
                    newInventory.setProduct(product);
                    newInventory.setSize(dto.getSize());
                    newInventory.setStockQuantity(dto.getStockQuantity());
                    productInventoryRepository.save(newInventory);
                }
            }

            // Nếu có thay đổi số lượng -> tạo expense
            if (totalCostAdjustment != 0) {
                Expenses expenses = new Expenses();
                expenses.setExpenseMonth(product.getCreatedAt().getMonthValue()); // đúng theo thời gian sản phẩm
                expenses.setExpenseYear(product.getCreatedAt().getYear());
                expenses.setExpenseAmount(totalCostAdjustment);
                expenses.setDescription("Nhập hàng: " + product.getProductName());
                expenses.setCreatedAt(product.getCreatedAt()); // giữ nguyên thời gian gốc

                expenseService.addExpense(expenses);

            }
        }
        return "Cập nhật sản phẩm thành công";
    }
}
