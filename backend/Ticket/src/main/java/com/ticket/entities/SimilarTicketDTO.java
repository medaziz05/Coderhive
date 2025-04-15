package com.ticket.entities;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class SimilarTicketDTO {
    private Long id;
    private String title;
    private String description;
    private String status;
    private LocalDateTime resolvedAt;
    private String category;
    private Long conversationId;

    public SimilarTicketDTO() {
    }

    public SimilarTicketDTO(Ticket ticket) {
        this.id = ticket.getId();
        this.title = ticket.getTitle();
        this.description = ticket.getDescription();
        this.status = ticket.getStatus().toString();
        this.category = ticket.getCategory();
        if (ticket.getConversation() != null) {
            this.conversationId = ticket.getConversation().getId();
        }
    }

    // Static method to convert a list of tickets to DTOs
    public static List<SimilarTicketDTO> fromTickets(List<Ticket> tickets) {
        return tickets.stream()
                .map(SimilarTicketDTO::new)
                .collect(Collectors.toList());
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getConversationId() {
        return conversationId;
    }

    public void setConversationId(Long conversationId) {
        this.conversationId = conversationId;
    }
}
