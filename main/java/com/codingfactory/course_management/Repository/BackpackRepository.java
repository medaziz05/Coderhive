package com.codingfactory.course_management.Repository;

import com.codingfactory.course_management.entity.Backpack;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BackpackRepository extends JpaRepository<Backpack, Long> {
    List<Backpack> findAllByOrderByCreatedAtDesc();
}