package com.andrew.event.service;

import com.andrew.event.model.Event;
import com.andrew.event.repo.EventRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepo eventRepo;

    public Event saveEvent(Event event) {
        return eventRepo.save(event);
    }

    public List<Event> getAllEvents() {
        List<Event> events = eventRepo.findAll();
        return events;
    }

    public Event getEventByTitle(String title) {
        Event event = eventRepo.findByTitle(title);
        return event;
    }

    public List<Event> getEventsByKeyword(String keyword) {
        List<Event> events = eventRepo.findByTitleContaining(keyword);
        return events;
    }

    public List<Event> getEventsByStartDate(LocalDate startDate) {
        List<Event> events = eventRepo.findByStartDate(startDate);
        return events;
    }

    public List<Event> getEventsByUser(String username) {
        List<Event> events = eventRepo.findByCreatedBy(username);
        return events;
    }

    public String deleteEvent(String eventId) {
        if(eventRepo.findByEventId(eventId) != null)
            eventRepo.deleteByEventId(eventId);
        return "Event with ID "+eventId+" removed";
    }

    public String updateEvent(Event event) {
        Event existingEvent = eventRepo.findByEventId(event.getEventId());
        if(existingEvent != null) {
            existingEvent.setEventId(event.getEventId());
            existingEvent.setTitle(event.getTitle());
            existingEvent.setDescription(event.getDescription());
            existingEvent.setStartDate(event.getStartDate());
            existingEvent.setStartTime(event.getStartTime());
            existingEvent.setEndDate(event.getEndDate());
            existingEvent.setEndTime(event.getEndTime());
            existingEvent.setCreatedBy(event.getCreatedBy());
            eventRepo.save(existingEvent);
            return "Event successfully updated";
        }
        else
            return "No such event found";
    }
}
