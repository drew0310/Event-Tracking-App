package com.andrew.event.repo;

import com.andrew.event.model.Event;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;


@Repository
public interface EventRepo extends MongoRepository<Event, String> {

    Event findByTitle(String title);
    List<Event> findByTitleContaining(String keyword);
    List<Event> findByStartDate(LocalDate startDate);
    List<Event> findByCreatedBy(String createdBy);
    Event findByEventId(String eventId);

    void deleteByEventId(String eventId);

    @Transactional
    void deleteByCreatedBy(String createdBy);
}
