package com.example.backend.service;


import com.example.backend.dto.CartItemDto;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductInventoryRepository productInventoryRepository;

    public List<CartItemDto> getCartItemsByUsername(String username){
        Users user = userRepository.findByUserName(username);
        Carts cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null) {
            return List.of(); // Trả về danh sách rỗng nếu không tìm thấy giỏ hàng
        }

        //Lấy danh sách cartItem của giỏ hàng rồi chuyển đổi thành CartItemDTO bằng phương thức map()
        List<CartItemDto> cartItems = cartItemRepository.findByCart(cart)
                .stream()
                .map(item -> new CartItemDto(
                        item.getProductInventory().getProductInventoryId(),
                        item.getProductInventory().getProduct().getProductName(),
                        item.getProductInventory().getProduct().getImageList().get(0).getUrl(),
                        item.getQuantity(),
                        item.getProductInventory().getProduct().getPrice()
                ))
                .toList();
        return cartItems;
    }

    public String addToCart(String username, int productId, int quantity) {
        Users user = userRepository.findByUserName(username);

        if(user==null) {
            return "Người dùng không tồn tại, vui lòng thử lại";
        }

        ProductInventory product = productInventoryRepository.findById(productId).orElse(null);

        if(product == null) {
            return "Sản phẩm không tồn tại, vui lòng thử lại";
        }

        Carts cart = cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Carts newCart = Carts.builder()
                            .user(user)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return cartRepository.save(newCart);
                });

        Optional<CartItems> existingCartItem = cartItemRepository.findByCartAndProductInventory(cart, product);
        //Nếu đã có trong giỏ hàng thì tăng số lượng lên thêm một lượng "quantity"
        if (existingCartItem.isPresent()) {
            CartItems cartItem = existingCartItem.get();
            cartItem.setQuantity(quantity); // set đúng số lượng mới, không cộng
            cartItemRepository.save(cartItem);
        } else {
            CartItems cartItem = CartItems.builder()
                    .cart(cart)
                    .productInventory(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(cartItem);
        }
        return "Thêm sản phẩm vào giỏ hàng thành công!";
    }

    public String removeFromCart(String username, int productId){
        Users user = userRepository.findByUserName(username);
        if(user == null){
            return "Người dùng không tồn tại, vui lòng thử lại!";
        }
        ProductInventory product = productInventoryRepository.findById(productId).orElse(null);
        if (product == null) {
            return "Sản phẩm không tồn tại, vui lòng thử lại!";

        }
        Carts cart = cartRepository.findByUser(user)
                .orElse(null);
        CartItems cartItem = cartItemRepository.findByCartAndProductInventory(cart,product).orElse(null);
        if(cartItem == null){
            return "Sản phẩm này không tồn tại trong giỏ hàng, vui lòng thử lại!";
        }
        cartItemRepository.delete(cartItem);
        return "Xóa sản phẩm khỏi giỏ hàng thành công!";
    }
}
