package com.andrew.event.controller;


import com.andrew.event.model.Event;
import com.andrew.event.model.User;
import com.andrew.event.repo.EventRepo;
import com.andrew.event.service.EmailService;
import com.andrew.event.service.EventService;
import com.andrew.event.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RestControllerAdvice
@CrossOrigin(origins = "https://planifyevent.netlify.app")
@RequestMapping("/app")
public class MainController {

    @Autowired
    private EventService eventService;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;




    @PostMapping("/users/addUser")
    public ResponseEntity<?> addUser(@RequestBody User user) {
        if(userService.getUserByUsername(user.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already exists");
        }
        userService.saveUser(user);
        emailService.sendEmail(user.getEmail(), "Welcome to Planify!", "Hi "+user.getUsername()+"!\n\nWelcome to Planify, a simple and easy-to-use tool for creating, managing and tracking your events and tasks, be it personal, professional, travel-related, or just anything. We're glad to have you on board!\n\nHappy planning!");
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully!");
    }

    @DeleteMapping("/users/deleteUser/{username}")
    public ResponseEntity<?> deleteUser(@PathVariable String username) {
        String email = userService.getUserByUsername(username).getEmail();
        String message = userService.deleteUser(username);
        emailService.sendEmail(email, "Planify | Account Deletion ALERT!", "Hi "+username+"!\n\nYour Planify account has been successfully deleted from our system. As a result, you will no longer be able to access your account, and all associated event data have been removed as per our data retention policy.\n\nThank you for being a part of our platform. We appreciate your time with us, and hope to serve you again in the future. Cheers!\n\nRegards,\nPlanify");
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PutMapping("/users/updateUser/{username}")
    public ResponseEntity<?> updateUser(@RequestBody User user, @PathVariable String username) {
        String message = userService.updateUser(user, username);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @GetMapping("/users/fetchUserByUsername/{username}")
    public ResponseEntity<?> findUserByUsername(@PathVariable String username) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getUserByUsername(username));
    } 





    

    @PostMapping("/events/addEvent")
    public ResponseEntity<?> addEvent(@RequestBody Event event) {
        if(eventService.saveEvent(event) != null) {
            User createdUser = userService.getUserByUsername(event.getCreatedBy());
            emailService.sendEmail(createdUser.getEmail(), "Planify | ALERT! New Event Created!", "Dear "+createdUser.getUsername()+",\n\nYour event '"+event.getTitle()+"' has been created successfully, and is scheduled on "+event.getStartDate().toString()+" at "+event.getStartTime().toString()+".\n\nHappy tracking!\n\nRegards,\nPlanify");
            return ResponseEntity.status(HttpStatus.CREATED).body("Event created successfully!");
        }
        else
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to create event!");
    }

    @GetMapping("/events/fetchEvents")
    public ResponseEntity<?> findAllEvents() {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getAllEvents());
    }

    @GetMapping("/events/fetchEventsByTitle/{title}")
    public ResponseEntity<?> findEventByTitle(@PathVariable String title) {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getEventByTitle(title));
    }

    @GetMapping("/events/fetchEventsByKeyword/{keyword}")
    public ResponseEntity<?> findEventsByKeyword(@PathVariable String keyword) {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getEventsByKeyword(keyword));
    }

    @GetMapping("/events/fetchEventsByStartDate/{startDate}")
    public ResponseEntity<?> findEventsByStartDate(@PathVariable LocalDate startDate) {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getEventsByStartDate(startDate));
    }

    @GetMapping("/events/fetchEventsByUser/{username}")
    public ResponseEntity<?> findEventsByUser(@PathVariable String username) {
        return ResponseEntity.status(HttpStatus.OK).body(eventService.getEventsByUser(username));
    }

    @DeleteMapping("/events/deleteEvent/{eventId}")
    public ResponseEntity<?> deleteEvent(@PathVariable String eventId) {
        String message = eventService.deleteEvent(eventId);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

    @PutMapping("/events/updateEvent")
    public ResponseEntity<?> updateEvent(@RequestBody Event event) {
        String message = eventService.updateEvent(event);
        User createdUser = userService.getUserByUsername(event.getCreatedBy());
        emailService.sendEmail(createdUser.getEmail(), "Planify | ALERT! Event Updated!", "Dear "+createdUser.getUsername()+",\n\nYour event has been updated successfully.\n\nTitle: "+event.getTitle()+"\nDescription: "+event.getDescription()+"\nStart Date: "+event.getStartDate().toString()+"\nStart Time: "+event.getStartTime().toString()+"\n\nHappy tracking!\n\nRegards,\nPlanify");
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }
}
