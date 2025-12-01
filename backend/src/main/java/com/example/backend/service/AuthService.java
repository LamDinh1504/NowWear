package com.example.backend.service;

import com.example.backend.dto.LoginUserDto;
import com.example.backend.dto.RegisterUserDto;
import com.example.backend.entity.Orders;
import com.example.backend.entity.Roles;
import com.example.backend.entity.Users;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository usersRepo;

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private OrderService  orderService;

    /**
     * Đăng ký tài khoản mới (role mặc định: CUSTOMER)
     */
    @Transactional
    public String registerUser(RegisterUserDto dto) {
        if (userRepository.existsByUserName(dto.getUsername())) {
            throw new RuntimeException("Tên đăng nhập này đã được sử dụng!");
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email này đã được sử dụng!");
        }

        Roles customerRole = roleRepository.findByRoleName("CUSTOMER");
        if (customerRole == null) {
            throw new RuntimeException("Role CUSTOMER chưa tồn tại trong hệ thống!");
        }

        String encodedPassword = bCryptPasswordEncoder.encode(dto.getPassword());

        Users user = Users.builder()
                .fullName(dto.getFullname())
                .userName(dto.getUsername())
                .passwordHash(encodedPassword)
                .email(dto.getEmail())
                .createAt(LocalDateTime.now())
                .roleSet(new HashSet<>())
                .build();

        user.getRoleSet().add(customerRole);
        userRepository.save(user);

        return "Đăng ký người dùng thành công!";
    }

    @Transactional
    public String loginUser(LoginUserDto loginUserDto){
        Users loginUser = userRepository.findByUserName(loginUserDto.getUsername());
        if(loginUser == null) {
            throw new RuntimeException("Tên đăng nhập không tồn tại!");
        }
        if (!bCryptPasswordEncoder.matches(loginUserDto.getPassword(), loginUser.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu không chính xác!");
        }
        try {
            String token = jwtService.generateToken(loginUser.getUserName());
            System.out.println("Generated JWT token: " + token);
            return token;
        } catch (Exception e) {
            e.printStackTrace(); // in chi tiết lỗi ra console
            throw new RuntimeException("Lỗi khi tạo token JWT: " + e.getMessage());
        }
    }

    @Transactional
    public String deleteAuthService(String username) {
        Users user = usersRepo.findByUserName(username);

        List<Orders> orderList = orderRepo.findByUsers(user);

        for(Orders  order : orderList) {
            orderService.deleteOrders(order.getOrderId(),username);
        }
        if(user == null) {
            return "Người dùng không tồn tại";
        }

        usersRepo.delete(user);
        return "Xóa người dùng thành công";
    }
}
