package com.andrew.event.service;

import com.andrew.event.model.User;
import com.andrew.event.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User saveUser(User user) {
        return userRepo.save(user);
    }

    public User getUserByUsername(String username) {
        User user = userRepo.findByUsername(username);
        return user;
    }

    public String deleteUser(String username) {
        if(userRepo.findByUsername(username) != null)
            userRepo.deleteByUsername(username);
        return "User with username "+username+" removed";
    }

    public String updateUser(User user) {
        User existingUser = userRepo.findByUsername(user.getUsername());
        if(existingUser != null) {
            existingUser.setUsername(user.getUsername());
            existingUser.setPassword(user.getPassword());
            existingUser.setEmail(user.getEmail());
            userRepo.save(existingUser);
            return "User successfully updated";
        }
        else
            return "No such user found";

    }


}
