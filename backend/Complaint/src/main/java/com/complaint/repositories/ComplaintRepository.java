package com.complaint.repositories;


import com.complaint.entities.ComplaintPriority;
import com.complaint.entities.Complaintts;
import com.complaint.entities.StatusCom;
import com.complaint.entities.TypeCom;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ComplaintRepository extends CrudRepository<Complaintts,Integer > {
    List<Complaintts> findByStatus(StatusCom status);
    List<Complaintts> findByMail(String mail);
    List<Complaintts> findAllByOrderByDateDesc();
    List<Complaintts> findByType(TypeCom type);
    List<Complaintts> findByIsAnonymousTrue();
    List<Complaintts> findByIsAnonymousFalse();

    List<Complaintts> findByPriority(ComplaintPriority priority);
    @Query("SELECT COUNT(c) FROM Complaintts c WHERE c.status = :status")
    long countByStatus(@Param("status") StatusCom status);
    List<Complaintts> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Complaintts> findByDateBetweenOrderByDateDesc(LocalDateTime newDate, LocalDateTime oldDate);

    // Search by title containing the search term (case-insensitive)
    // In your repository interface
    @Query("SELECT c FROM Complaintts c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ORDER BY c.date DESC")
    List<Complaintts> findByTitleContainingIgnoreCase(@Param("searchTerm") String searchTerm);

}

