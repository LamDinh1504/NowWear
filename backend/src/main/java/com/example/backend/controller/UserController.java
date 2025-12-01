package com.example.backend.controller;
import com.example.backend.dto.UserDto;
import com.example.backend.entity.Users;
import com.example.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api")
public class UserController {
    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public List<UserDto> getUsers() {
        List<Users> users = userRepository.findAll();

        List<UserDto> userDTOs = users.stream().map(user -> new UserDto(
                user.getUserId(), user.getFullName(), user.getUserName(),
                user.getEmail(),user.getCreateAt())
        ).toList();
        return userDTOs;
    }
}
