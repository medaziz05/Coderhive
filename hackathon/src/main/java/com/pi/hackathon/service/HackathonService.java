package com.pi.hackathon.service;

import com.pi.hackathon.entities.Hackathon;
import com.pi.hackathon.entities.HackathonParticipation;
import com.pi.hackathon.repository.HackathonRepository;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class HackathonService {
    private final HackathonRepository hackathonRepository;

    public Hackathon createHackathon(Hackathon hackathon) {
        return hackathonRepository.save(hackathon);
    }

    // Get a Hackathon by ID
    public Optional<Hackathon> getHackathonById(int id) {
        return hackathonRepository.findById(id);
    }

    // Get all Hackathons with pagination
    public Page<Hackathon> getAllHackathons(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return hackathonRepository.findAll(pageable);
    }

    // Update an existing Hackathon
    public Hackathon updateHackathon(int id, Hackathon updatedHackathon) {
        return hackathonRepository.findById(id).map(hackathon -> {
            hackathon.setTitle(updatedHackathon.getTitle());
            hackathon.setDescription(updatedHackathon.getDescription());
            hackathon.setLocation(updatedHackathon.getLocation());
            hackathon.setStartTime(updatedHackathon.getStartTime());
            hackathon.setEndTime(updatedHackathon.getEndTime());
            hackathon.setNbrPlaces(updatedHackathon.getNbrPlaces());
            hackathon.setNiveauDifficulte(updatedHackathon.getNiveauDifficulte());
            hackathon.setNiveauImportance(updatedHackathon.getNiveauImportance());
            return hackathonRepository.save(hackathon);
        }).orElseThrow(() -> new RuntimeException("Hackathon not found"));
    }

    // Delete a Hackathon
    public void deleteHackathon(int id) {
        hackathonRepository.deleteById(id);
    }

    // Get all participants of a Hackathon
    public List<HackathonParticipation> getParticipants(int hackathonId) {
        return hackathonRepository.findById(hackathonId)
                .map(Hackathon::getParticipations)
                .orElseThrow(() -> new RuntimeException("Hackathon not found"));
    }
}
