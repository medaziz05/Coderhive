package com.pi.trainingenrollment.repository;

import com.pi.trainingenrollment.entities.Progress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgressRepository extends JpaRepository<Progress, Integer> {
}
