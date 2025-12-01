package com.example.backend.service;

import com.example.backend.dto.OrderDto;
import com.example.backend.dto.OrderItemDto;
import com.example.backend.dto.OrderRequestDto;
import com.example.backend.dto.OrderResponseDto;
import com.example.backend.entity.*;
import com.example.backend.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private ProductInventoryRepository  productInventoryRepository;

    @Autowired
    private RevenueService revenueService;

    @Transactional
    public List<OrderResponseDto> getOrdersByUsername(String username){
        Users user = userRepository.findByUserName(username);
        if(user == null) throw new RuntimeException("Người dùng không tồn tại, vui lòng thử lại!");
        List<Orders> orderList = orderRepository.findByUsers(user);
        List<OrderResponseDto> orderResponseDTOList = orderList.stream().map(order -> new OrderResponseDto(
                order.getOrderId(),
                order.getShippingFee(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getPaymentMethod(),
                order.getOrderProcess(),
                order.getCreatedAt()
        )).toList();
        return orderResponseDTOList;
    }

    @Transactional
    public List<OrderItemDto> getOrderItemsByOrderId(int orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại!"));

        List<OrderItemDto> items = order.getOrderItemList().stream()
                .map(item -> new OrderItemDto(
                        item.getOrderItemId(),
                        item.getProductInventory().getProduct().getProductName(),
                        item.getQuantity(),
                        item.getUnitPrice()
                )).toList();

        return items;
    }

    @Transactional
    public List<OrderDto> getOrders(){
        List<Orders> orders = orderRepository.findAll();
        List<OrderDto> orderDTOs = orders.stream().map(order -> new OrderDto(
                order.getOrderId(),
                order.getUsers().getFullName(),
                order.getUsers().getUserName(),
                order.getUsers().getEmail(),
                order.getAddresses().getPhone(),
                order.getAddresses().getCity(),
                order.getAddresses().getDistrict(),
                order.getAddresses().getStreet(),
                order.getCreatedAt(),
                order.getPaymentMethod(),
                order.getStatus(),
                order.getOrderProcess(),
                order.getOrderItemList().stream()
                        .map(item -> new OrderItemDto(
                                item.getOrderItemId(),
                                item.getProductInventory().getProduct().getProductName(),
                                item.getQuantity(),
                                item.getUnitPrice()
                        )).toList(),
                order.getTotalAmount()
        )).toList();
        return orderDTOs;
    }

    @Transactional
    public OrderResponseDto createOrder(OrderRequestDto orderRequestDTO, String username) {
        //Lấy các đối tượng cần thiết (đã có)
        Users user = userRepository.findByUserName(username);
        if (user == null) throw new RuntimeException("Người dùng không tồn tại, vui lòng thử lại!");
        Carts cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null) throw new RuntimeException("Giỏ hàng không tồn tại, vui lòng thử lại!");
        List<CartItems> cartItems = cartItemRepository.findByCart(cart);

        //Tạo các đối tượng cần có trong Order(chưa có)
        Orders order = new Orders();
        Addresses address = new Addresses();

        //Xử lý nếu giỏ hàng rỗng
        if(cartItems.isEmpty())throw new RuntimeException("Giỏ hàng của bạn đang rỗng!");

        //Kiểm tra stock có đủ chưa
        for(CartItems currentCartItem : cartItems){
            //Lấy quantity của CartItem so sánh với stock của Product
            ProductInventory currentProduct = currentCartItem.getProductInventory();
            if(currentProduct.getStockQuantity() < currentCartItem.getQuantity()) {
                throw new RuntimeException("Sản phẩm " + currentProduct.getProduct().getProductName() + " không đủ hàng");
            }
        }

        //Xử lý địa chỉ được người dùng nhập
        address.setCity(orderRequestDTO.getCity());
        address.setDistrict(orderRequestDTO.getDistrict());
        address.setStreet(orderRequestDTO.getStreet());
        address.setPhone(orderRequestDTO.getPhone());
        address.setOrderList(new ArrayList<>()); //Đặt ArrayList mởi để tránh NullPointerException trước
        addressRepository.save(address);

        //Tính tổng tiền hàng (CHƯA phải totalAmount của entity Order)
        float subtotal = 0;
        for(CartItems currentCartItem : cartItems){
            ProductInventory currentProduct = currentCartItem.getProductInventory();
            float currentProductTotalPrice = currentProduct.getProduct().getPrice() * currentCartItem.getQuantity();
            subtotal += currentProductTotalPrice;
        }

        float shippingFee = 30000;
        if(subtotal >= 500) shippingFee=0;

        //Tính tổng thanh toán
        float totalAmount = subtotal + shippingFee;

        //Lấy phương thức đặt hàng
        String paymentMethod = orderRequestDTO.getPaymentMethod();

        String order_process= "Chờ xử lý";

        //Tạo hóa đơn từ các thông tin đã tìm được trên
        order.setUsers(user);
        order.setAddresses(address);
        order.setCreatedAt(LocalDateTime.now());
        order.setShippingFee(shippingFee);
        order.setTotalAmount(totalAmount);
        order.setPaymentMethod(paymentMethod);
        order.setOrderProcess(order_process);
        order.setStatus(paymentMethod.equals("Tiền mặt") ? "Chưa thanh toán" : "Đã thanh toán");
        order.setOrderItemList(new ArrayList<>()); //Đặt ArrayList mởi để tránh NullPointerException trước
        orderRepository.save(order);

        //Tạo danh sách các chi tiết hóa đơn (sao cho tồn tại quan hệ ManyToOne: OrderItem - Order, OrderItem - Product)
        List<OrderItems> orderItemList = new ArrayList<>();
        for(CartItems currentCartItem : cartItems){
            ProductInventory currentProduct = currentCartItem.getProductInventory();
            OrderItems orderItem = new OrderItems();

            orderItem.setOrder(order);
            orderItem.setProductInventory(currentProduct);
            orderItem.setQuantity(currentCartItem.getQuantity());
            orderItem.setUnitPrice(currentProduct.getProduct().getPrice());
            orderItemRepository.save(orderItem);

            //Lúc này ta mới thêm vào OrderItemList của Order
            order.getOrderItemList().add(orderItem);

            //Trừ đi tồn kho sản phẩm
            currentProduct.setStockQuantity(currentProduct.getStockQuantity() -  currentCartItem.getQuantity());
            productInventoryRepository.save(currentProduct);

            orderItemList.add(orderItem);
        }

        //Cập nhật lại OrderItemList trong Order(lúc trước là new ArrayList<> rỗng)
        order.setOrderItemList(orderItemList);
        orderRepository.save(order); //Lưu lại luôn -> phải làm nhiều bước như này để tránh các trường hợp lỗi NullPointerException

        //Cập nhật lại OrderLt trong Address luôn
        address.getOrderList().add(order);
        addressRepository.save(address);

        //Xóa các CartItem trong Cart hiện tại
        cartItemRepository.deleteAll(cartItems);

        //Trả về
        OrderResponseDto orderResponseDTO = new OrderResponseDto();
        orderResponseDTO.setOrderId(order.getOrderId());
        orderResponseDTO.setShippingFee(order.getShippingFee());
        orderResponseDTO.setTotalAmount(order.getTotalAmount());
        orderResponseDTO.setStatus(order.getStatus());
        orderResponseDTO.setPaymentMethod(order.getPaymentMethod());
        orderResponseDTO.setCreatedAt(order.getCreatedAt());
        return orderResponseDTO;
    }

    public String deleteOrders(int orderId,String username) {
        Orders  order = orderRepository.findById(orderId).orElse(null);
        if(order == null) {
            return "Đơn hàng không tồn tại";
        }
        List<OrderItems>  orderItemList = orderItemRepository.findByOrder(order);

        for(OrderItems orderItems : orderItemList){
            orderItemRepository.delete(orderItems);
        }
        orderRepository.delete(order);

        return "Xóa đơn hàng thành công";
    }

    public String cancellOrders(int orderId,String username) {
        Orders  order = orderRepository.findById(orderId).orElse(null);
        if(order == null) {
            return "Đơn hàng không tồn tại";
        }
        List<OrderItems>  orderItemList = orderItemRepository.findByOrder(order);

        for(OrderItems orderItems : orderItemList){
            ProductInventory productInventory = productInventoryRepository.findByProductInventoryId(orderItems.getProductInventory().getProductInventoryId());
            productInventory.setStockQuantity(productInventory.getStockQuantity() + orderItems.getQuantity());
            productInventoryRepository.save(productInventory);
            orderItemRepository.delete(orderItems);
        }
        order.setOrderProcess("Đã hủy");
        orderRepository.save(order);
        return "Hủy đơn hàng thành công";
    }

    public OrderResponseDto markPaid(int orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        order.setStatus("Đã thanh toán");
        orderRepository.save(order);

        revenueService.addIncome(order.getTotalAmount(), order.getCreatedAt());

        OrderResponseDto orderResponeDto= new OrderResponseDto();
        orderResponeDto.setOrderId(order.getOrderId());
        orderResponeDto.setShippingFee(order.getShippingFee());
        orderResponeDto.setTotalAmount(order.getTotalAmount());
        orderResponeDto.setStatus(order.getStatus());
        orderResponeDto.setPaymentMethod(order.getPaymentMethod());
        orderResponeDto.setCreatedAt(order.getCreatedAt());



        return orderResponeDto;
    }

    public OrderResponseDto unMarkPaid(int orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        order.setStatus("Chưa thanh toán");
        orderRepository.save(order);

        revenueService.subtractIncome(order.getTotalAmount(), order.getCreatedAt());

        OrderResponseDto orderResponeDto= new OrderResponseDto();
        orderResponeDto.setOrderId(order.getOrderId());
        orderResponeDto.setShippingFee(order.getShippingFee());
        orderResponeDto.setTotalAmount(order.getTotalAmount());
        orderResponeDto.setStatus(order.getStatus());
        orderResponeDto.setPaymentMethod(order.getPaymentMethod());
        orderResponeDto.setCreatedAt(order.getCreatedAt());

        return orderResponeDto;
    }

    public String updateOrder(int orderId, String processOrder) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Đơn hàng không tồn tại"));

        switch (processOrder) {
            case "Chờ xử lý":
            case "Đang giao":
            case "Hoàn tất":
                order.setOrderProcess(processOrder);
                break;

            default:
                throw new RuntimeException("Trạng thái không hợp lệ!");
        }

        orderRepository.save(order);
        return "Cập nhật thành công";
    }
}
