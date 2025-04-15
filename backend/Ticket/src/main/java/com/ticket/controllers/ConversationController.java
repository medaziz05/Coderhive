package com.ticket.controllers;

import com.ticket.entities.Conversation;
import com.ticket.services.ConversationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/conversations") // ✅ route dédiée à conversation
@CrossOrigin(origins = "http://localhost:4200")
public class ConversationController {

    @Autowired
    private ConversationService conversationService;

    @PostMapping("/ticket/{ticketId}") // ✅ create: POST /api/conversations/ticket/{ticketId}
    public ResponseEntity<Conversation> createConversation(@PathVariable Long ticketId) {
        return ResponseEntity.ok(conversationService.createConversation(ticketId));
    }

    @PostMapping("/close/{conversationId}") // ✅ close: POST /api/conversations/close/{id}
    public ResponseEntity<String> closeConversation(@PathVariable Long conversationId) {
        conversationService.closeConversation(conversationId);
        return ResponseEntity.ok("Conversation closed");
    }

    @GetMapping("/ticket/{ticketId}") // ✅ get by ticket ID
    public ResponseEntity<Conversation> getByTicketId(@PathVariable Long ticketId) {
        return ResponseEntity.ok(conversationService.getByTicketId(ticketId));
    }

    @GetMapping("/{id}") // ✅ get by conversation ID
    public Conversation getConversationById(@PathVariable Long id) {
        return conversationService.getConversationById(id);
    }
}
