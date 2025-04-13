package com.pi.trainingenrollment.repository;

import com.pi.trainingenrollment.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
    List<Participant> findByUser_Id(int userId);
}
