package com.pi.trainingenrollment.controller;


import com.pi.trainingenrollment.entities.User;
import com.pi.trainingenrollment.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/enrollment/users")


public class UserController {

    @Autowired
    private UserService userService;

    // 🔐 Inscription par nom + email
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return userService.register(user);
    }

    // 🔐 Connexion par email
    @GetMapping("/login")
    public User login(@RequestParam String email) {
        return userService.loginOrRegister(email); // tu peux renommer si besoin
    }



    @GetMapping("/all")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }








}


