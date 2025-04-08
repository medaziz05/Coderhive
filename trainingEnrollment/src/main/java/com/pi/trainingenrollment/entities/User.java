package com.pi.trainingenrollment.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String username;
    @Column(unique = true)
    private String email;


    public User(String username, String email) {
        this.username = username;
        this.email = email;
    }
}
