package com.andrew.event.controller;

import com.andrew.event.model.User;
import com.andrew.event.repo.UserRepo;
import com.andrew.event.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

class LoginRequest {
    private String username;
    private String password;

    // Getters and Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

@RestController
@RequestMapping("/app")
public class AuthController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private EmailService emailService;


    @PostMapping("/users/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null || !user.getPassword().equals(loginRequest.getPassword())) {
            return ResponseEntity.status(401).body("Invalid username or password, please try again!");
        }
        return ResponseEntity.ok("Login successful");
    }

    @GetMapping("/users/forgot-password/{username}")
    public ResponseEntity<?> forgotPassword(@PathVariable String username) {
        User user = userRepository.findByUsername(username);

        if(user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Account not found, please create a new account first!");
        }

        emailService.sendEmail(user.getEmail(), "Planify | Forgot Password Notification", "Hey "+user.getUsername()+"!\n\nLooks like you're back after quite a looonggg time! Don't panic, we're here to help you out.\n\nYour Momentrix account password is: "+user.getPassword()+"\n\nFeel free to change your password if required, by going to your profile page after logging in.\n\nCheers and happy planning!\n\nRegards,\nPlanify");
        return ResponseEntity.status(HttpStatus.OK).body("Account found, user password sent to email ID!");
    }
}

