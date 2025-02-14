package com.andrew.event.repo;

import com.andrew.event.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends MongoRepository<User, String> {

    User findByUsername(String username);

    void deleteByUsername(String username);
}
