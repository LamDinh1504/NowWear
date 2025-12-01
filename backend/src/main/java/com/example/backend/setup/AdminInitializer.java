package com.example.backend.setup;

import com.example.backend.entity.Roles;
import com.example.backend.entity.Users;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;

@Component
public class AdminInitializer  implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "lamdv15042005@gmail.com";
        String adminPassword = "123";

        //Nếu email admin này đã được tạo rồi thì không tạo nữa -> đảm bảo không phải lần nào chạy cũng phải tạo lại admin
        if (!userRepository.existsByEmail(adminEmail)) {

            Roles adminRole = roleRepository.findByRoleName("ADMIN");
            Roles customerRole = roleRepository.findByRoleName("CUSTOMER");

            // Tạo user admin
            Users admin = Users.builder()
                    .fullName("Đinh Văn Lâm")
                    .userName("admin")
                    .passwordHash(bCryptPasswordEncoder.encode(adminPassword))
                    .email(adminEmail)
                    .createAt(LocalDateTime.now())
                    .roleSet(new HashSet<>())
                    .build();

            admin.getRoleSet().add(adminRole);
            admin.getRoleSet().add(customerRole);

            userRepository.save(admin);
            System.out.println("Tạo tài khoản admin thành công");
        } else {
            System.out.println("Admin đã tồn tại. Không cần tạo mới");
        }
    }
}
