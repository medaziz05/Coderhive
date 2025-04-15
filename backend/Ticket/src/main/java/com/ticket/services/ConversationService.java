package com.ticket.services;

import com.ticket.entities.Conversation;
import com.ticket.entities.Ticket;
import com.ticket.repositories.ConversationRepository;
import com.ticket.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ConversationService {

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * Create and link a conversation to a ticket.
     * If the conversation already exists, return it.
     */
    public Conversation createConversation(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (ticket.getConversation() != null) {
            return ticket.getConversation(); // Already exists
        }

        Conversation conversation = new Conversation();
        conversation.setTicket(ticket);
        conversation.setActive(true);
        conversation.setClosed(false);
        conversation.setCreatedAt(LocalDateTime.now());

        Conversation savedConv = conversationRepository.save(conversation);
        ticket.setConversation(savedConv);
        ticketRepository.save(ticket);

        return savedConv;
    }

    /**
     * Close an active conversation by ID.
     */
    public void closeConversation(Long conversationId) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        conversation.setClosed(true);
        conversation.setActive(false);
        conversation.setClosedAt(LocalDateTime.now());

        conversationRepository.save(conversation);
    }

    /**
     * Get a conversation by ticket ID.
     */
    public Conversation getByTicketId(Long ticketId) {
        return conversationRepository.findByTicketId(ticketId)
                .orElseThrow(() -> new RuntimeException("Conversation not found for this ticket"));
    }

    /**
     * Start a conversation only if one doesn’t already exist.
     * (Alternative logic if needed separately)
     */
    public Conversation startConversation(Long ticketId) {
        Optional<Ticket> ticketOpt = ticketRepository.findById(ticketId);
        if (ticketOpt.isEmpty()) {
            throw new RuntimeException("Ticket not found");
        }

        Ticket ticket = ticketOpt.get();

        return conversationRepository.findByTicketId(ticketId)
                .orElseGet(() -> createConversation(ticketId));
    }
    
    public Conversation getConversationById(Long id) {
        return conversationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));
    }

}
