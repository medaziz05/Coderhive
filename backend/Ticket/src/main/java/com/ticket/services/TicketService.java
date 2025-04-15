package com.ticket.services;

import com.ticket.entities.Conversation;
import com.ticket.entities.SimilarTicketDTO;
import com.ticket.entities.Ticket;
import com.ticket.repositories.TicketRepository;
import com.ticket.repositories.ConversationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TicketService {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private SimilarityService similarityService;

    public Ticket createTicket(Ticket ticket) {
        ticket.setStatus(Ticket.Status.IN_PROGRESS);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setUpdatedAt(LocalDateTime.now());
        // Category is already set from the incoming ticket object
        return ticketRepository.save(ticket);
    }

    public List<Ticket> getAllTickets() {
        return ticketRepository.findAll();
    }

    public Ticket getTicketById(Long id) {
        return ticketRepository.findById(id).orElse(null);
    }

    public List<Ticket> getUserTickets(Long userId) {
        System.out.println("🔍 Fetching tickets for user ID: " + userId);
        List<Ticket> tickets = ticketRepository.findByUserId(userId);
        System.out.println("✅ Tickets found: " + tickets.size());
        return tickets;
    }

    public Ticket updateStatus(Long id, String status) {
        Ticket ticket = getTicketById(id);
        ticket.setStatus(Ticket.Status.valueOf(status));
        ticket.setUpdatedAt(LocalDateTime.now());

        // Fermer la conversation si RESOLVED
        if (status.equals("RESOLVED") && ticket.getConversation() != null) {
            Conversation conv = ticket.getConversation();
            conv.setClosed(true);
            conv.setActive(false);
            conv.setClosedAt(LocalDateTime.now());
            conversationRepository.save(conv);
        }

        return ticketRepository.save(ticket);
    }

    /**
     * Find similar resolved tickets for a given ticket
     * @param ticket The ticket to find similar ones for
     * @return List of similar resolved tickets as DTOs
     */
    public List<SimilarTicketDTO> findSimilarResolvedTickets(Ticket ticket) {
        return similarityService.findSimilarResolvedTickets(ticket);
    }

    /**
     * Find similar resolved tickets for a new ticket before saving it
     * @param newTicket The new ticket data from the form
     * @return List of similar resolved tickets as DTOs
     */
    public List<SimilarTicketDTO> findSimilarResolvedTicketsBeforeCreate(Ticket newTicket) {
        return similarityService.findSimilarResolvedTickets(newTicket);
    }
}