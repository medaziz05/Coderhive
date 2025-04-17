package com.codingfactory.course_management.Service;
import com.codingfactory.course_management.DTOS.BackpackDetailsDTO;
import com.codingfactory.course_management.DTOS.BackpackListDTO;
import com.codingfactory.course_management.DTOS.BackpackRequestDTO;
import com.codingfactory.course_management.entity.Backpack;
import com.codingfactory.course_management.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.codingfactory.course_management.Repository.BackpackRepository;

@Service
public class BackpackService {
    private final BackpackRepository backpackRepository;
    private final FileStorageService fileStorageService;
    private static final Long STATIC_TEACHER_ID = 1L;

    @Value("${upload.path}")
    private String uploadDir;

    @Value("${api.base.url}")
    private String apiBaseUrl;

    public BackpackService(BackpackRepository backpackRepository, FileStorageService fileStorageService) {
        this.backpackRepository = backpackRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public BackpackDetailsDTO createBackpack(BackpackRequestDTO requestDTO, MultipartFile image) throws IOException {
        Backpack backpack = new Backpack();
        backpack.setTitle(requestDTO.getTitle());
        backpack.setContent(requestDTO.getContent());
        backpack.setTeacherId(STATIC_TEACHER_ID);
        backpack.setCreatedAt(LocalDateTime.now());
        backpack.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(image.getInputStream(), filePath);
            backpack.setImageUrl(apiBaseUrl + "/uploads/" + fileName);
        }

        Backpack savedBackpack = backpackRepository.save(backpack);
        return convertToDetailsDTO(savedBackpack);
    }

    @Transactional
    public BackpackDetailsDTO updateBackpack(Long id, BackpackRequestDTO requestDTO, MultipartFile image) throws IOException {
        Backpack backpack = backpackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Backpack not found"));

        backpack.setTitle(requestDTO.getTitle());
        backpack.setContent(requestDTO.getContent());
        backpack.setUpdatedAt(LocalDateTime.now());

        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            if (backpack.getImageUrl() != null) {
                String oldFileName = backpack.getImageUrl().replace(apiBaseUrl + "/uploads/", "");
                Files.deleteIfExists(Paths.get(uploadDir, oldFileName));
            }

            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);
            Files.copy(image.getInputStream(), filePath);
            backpack.setImageUrl(apiBaseUrl + "/uploads/" + fileName);
        }

        Backpack updatedBackpack = backpackRepository.save(backpack);
        return convertToDetailsDTO(updatedBackpack);
    }

    @Transactional(readOnly = true)
    public List<BackpackListDTO> getAllBackpacks() {
        return backpackRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToListDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BackpackDetailsDTO getBackpackById(Long id) {
        return backpackRepository.findById(id)
                .map(this::convertToDetailsDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Backpack not found"));
    }

    @Transactional
    public void deleteBackpack(Long id) throws IOException {
        Backpack backpack = backpackRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Backpack not found"));

        if (backpack.getImageUrl() != null) {
            String fileName = backpack.getImageUrl().replace(apiBaseUrl + "/uploads/", "");
            Files.deleteIfExists(Paths.get(uploadDir, fileName));
        }

        backpackRepository.delete(backpack);
    }

    private BackpackDetailsDTO convertToDetailsDTO(Backpack backpack) {
        return new BackpackDetailsDTO(
                backpack.getBackpackId(),
                backpack.getTitle(),
                backpack.getContent(),
                backpack.getImageUrl(),
                backpack.getCreatedAt(),
                backpack.getUpdatedAt(),
                backpack.getTeacherId()
        );
    }

    private BackpackListDTO convertToListDTO(Backpack backpack) {
        return new BackpackListDTO(
                backpack.getBackpackId(),
                backpack.getTitle(),
                backpack.getImageUrl(),
                backpack.getCreatedAt()
        );
    }
}