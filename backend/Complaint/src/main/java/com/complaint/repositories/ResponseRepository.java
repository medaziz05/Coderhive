package com.complaint.repositories;

import com.complaint.entities.Response;
import org.springframework.data.repository.CrudRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ResponseRepository extends CrudRepository<Response, Integer> {
    List<Response> findByComplaintts_Idcomplaint(Integer idcomplaint);
    List<Response> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Response> findAllByOrderByDateDesc();
    long countByComplaintts_Idcomplaint(Integer idcomplaint);
}
