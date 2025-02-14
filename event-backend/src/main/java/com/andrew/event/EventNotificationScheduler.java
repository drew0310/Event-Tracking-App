package com.andrew.event;

import com.andrew.event.model.Event;
import com.andrew.event.model.User;
import com.andrew.event.repo.EventRepo;
import com.andrew.event.repo.UserRepo;
import com.andrew.event.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class EventNotificationScheduler {


    @Autowired
    private EventRepo eventRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    @Scheduled(fixedRate = 60000)
    public void checkAndSendNotification() {

        List<Event> upcomingEvents = eventRepo.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (Event event : upcomingEvents) {
            LocalDateTime startTime = LocalDateTime.of(event.getStartDate(), event.getStartTime());

            if (startTime.isBefore(now.plusMinutes(1)) && startTime.isAfter(now)) {
                User createdUser = userRepo.findByUsername(event.getCreatedBy());
                emailService.sendEmail(createdUser.getEmail(), "Planify | ALERT! Event Starting Now!",
                        "Hi " + createdUser.getUsername() + "!\n\nIt is now time for '" + event.getTitle() + "'.\n\nAbout the event:\n" + event.getDescription() + "\n\nCheers!\nPlanify");
            }
        }
    }
}
