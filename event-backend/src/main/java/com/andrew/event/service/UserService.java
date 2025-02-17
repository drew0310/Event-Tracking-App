package com.andrew.event.service;

import com.andrew.event.model.Event;
import com.andrew.event.model.User;
import com.andrew.event.repo.EventRepo;
import com.andrew.event.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EventRepo eventRepo;

    public User saveUser(User user) {
        return userRepo.save(user);
    }

    public User getUserByUsername(String username) {
        User user = userRepo.findByUsername(username);
        return user;
    }

    public String deleteUser(String username) {
        if(userRepo.findByUsername(username) != null) {
            userRepo.deleteByUsername(username);
            eventRepo.deleteByCreatedBy(username);
        }

        return "User with username "+username+" removed";
    }

    public String updateUser(User user, String username) {
        User existingUser = userRepo.findByUsername(username);
        if(existingUser != null) {
            userRepo.delete(existingUser);
            userRepo.save(user);
            List<Event> eventList = eventRepo.findAll();
            for(Event e : eventList) {
                if(e.getCreatedBy().equals(username)) {
                    eventRepo.deleteByCreatedBy(username);
                    e.setCreatedBy(user.getUsername());
                    eventRepo.save(e);
                }
            }
            return "User successfully updated";
        }
        else
            return "No such user found";

    }


}
