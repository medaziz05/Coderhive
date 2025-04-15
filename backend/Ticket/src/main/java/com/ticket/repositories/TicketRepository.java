package com.ticket.repositories;

import com.ticket.entities.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);

    List<Ticket> findByStatus(Ticket.Status status);

    @Modifying
    @Query("UPDATE Ticket t SET t.status = :status, t.updatedAt = CURRENT_TIMESTAMP WHERE t.id = :id")
    void updateStatus(@Param("id") Long id, @Param("status") String status);


    @Query("SELECT t FROM Ticket t WHERE t.status = 'RESOLVED' AND " +
            "(:category IS NULL OR t.category = :category)")
    List findSimilarResolvedTickets(
            @Param("searchTerm") String searchTerm,
            @Param("category") String category);
}