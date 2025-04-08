package com.pi.trainingenrollment.repository;

import com.pi.trainingenrollment.entities.Participant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParticipantRepository extends JpaRepository<Participant, Integer> {
}
