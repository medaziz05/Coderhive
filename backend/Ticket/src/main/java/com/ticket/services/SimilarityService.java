package com.ticket.services;

import com.ticket.entities.SimilarTicketDTO;
import com.ticket.entities.Ticket;
import com.ticket.repositories.TicketRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
@Service

public class SimilarityService {

    @Autowired
    private TicketRepository ticketRepository;

    /**
     * Find similar resolved tickets based on title, description, and category
     * @param ticket The ticket to find similar ones for
     * @return List of similar resolved tickets
     */
    public List<SimilarTicketDTO> findSimilarResolvedTickets(Ticket ticket) {
        // Extract keywords from title and description
        String searchTerms = extractKeywords(ticket.getTitle() + " " + ticket.getDescription());
        System.out.println("Termes de recherche: " + searchTerms);

        // Find similar tickets with the same category that are resolved
        List<Ticket> similarTickets = ticketRepository.findSimilarResolvedTickets(
                searchTerms, ticket.getCategory());

        // Convert to DTOs
        return SimilarTicketDTO.fromTickets(similarTickets);
    }

    /**
     * Extract keywords from text by removing common words and keeping significant terms
     * @param text The text to extract keywords from
     * @return A string with the most significant keywords
     */
    private String extractKeywords(String text) {
        if (text == null || text.isEmpty()) {
            return "";
        }

        // Conservons plus de mots pour améliorer la recherche
        String[] words = text.toLowerCase().split("\\W+");

        // Ne gardons que la liste des mots à exclure vraiment communs
        Set stopWords = new HashSet<>(Arrays.asList(
                "le", "la", "les", "et", "ou", "de", "du", "a", "à",
                "the", "and", "or", "but", "is", "are", "of", "in", "on"
        ));

        // Ne filtrons pas sur la longueur des mots
        List keywords = Arrays.stream(words)
                .filter(word -> !stopWords.contains(word))
                .collect(Collectors.toList());

        return String.join(" ", keywords);
    }
}
