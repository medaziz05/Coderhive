package com.ticket.controllers;

import com.ticket.entities.SimilarTicketDTO;
import com.ticket.entities.Ticket;
import com.ticket.services.ConversationService;
import com.ticket.services.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "http://localhost:4200")
public class TicketController {

    @Autowired
    private TicketService ticketService;

    @Autowired
    private ConversationService conversationService;

    @PostMapping
    public ResponseEntity<Ticket> createTicket(@RequestBody Ticket ticket) {
        return ResponseEntity.ok(ticketService.createTicket(ticket));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Ticket> updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(ticketService.updateStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Ticket>> getUserTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getUserTickets(userId));
    }

    @GetMapping
    @PreAuthorize("hasRole('admin')")
    public ResponseEntity<List<Ticket>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ticket> getTicketById(@PathVariable Long id) {
        // ✅ Optionnel : démarre une conversation automatiquement quand l’admin ouvre
        conversationService.startConversation(id);
        return ResponseEntity.ok(ticketService.getTicketById(id));
    }

    /**
     * Endpoint pour vérifier les tickets similaires avant de créer un nouveau ticket
     */
    @PostMapping("/check-similar")
    public ResponseEntity<List<SimilarTicketDTO>> checkSimilarBeforeCreate(@RequestBody Ticket newTicket) {
        List<SimilarTicketDTO> similarTickets = ticketService.findSimilarResolvedTicketsBeforeCreate(newTicket);
        return ResponseEntity.ok(similarTickets);
    }

    /**
     * Endpoint pour obtenir des tickets similaires à un ticket existant
     */
    @GetMapping("/{id}/similar")
    public ResponseEntity<List<SimilarTicketDTO>> getSimilarTickets(@PathVariable Long id) {
        Ticket ticket = ticketService.getTicketById(id);
        if (ticket == null) {
            return ResponseEntity.notFound().build();
        }
        List<SimilarTicketDTO> similarTickets = ticketService.findSimilarResolvedTickets(ticket);
        return ResponseEntity.ok(similarTickets);
    }
}
