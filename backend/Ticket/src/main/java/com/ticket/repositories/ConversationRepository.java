package com.ticket.repositories;

import com.ticket.entities.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import jakarta.transaction.Transactional;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    Optional<Conversation> findByTicketId(Long ticketId);

    @Modifying
    @Transactional
    @Query("UPDATE Conversation c SET c.active = false, c.closedAt = CURRENT_TIMESTAMP WHERE c.id = :id")
    void closeConversation(@Param("id") Long id);
}
