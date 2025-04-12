package com.pi.trainingenrollment.service;

import com.pi.trainingenrollment.entities.User;
import com.pi.trainingenrollment.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;




    public Optional<User> getById(int id) {
        return userRepository.findById(id);
    }
    public User register(User user) {
        return userRepository.save(user);
    }

    public User loginOrRegister(String email) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(new User("Participant Anonyme", email)));
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }


}

