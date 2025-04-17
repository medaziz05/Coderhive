package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.DTOS.BackpackDetailsDTO;
import com.codingfactory.course_management.DTOS.BackpackListDTO;
import com.codingfactory.course_management.DTOS.BackpackRequestDTO;
import com.codingfactory.course_management.Service.BackpackService;
import com.codingfactory.course_management.exception.ResourceNotFoundException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/backpacks")
@Tag(name = "Backpack Documentation", description = "Manage documentation entries")
@CrossOrigin(origins = "http://localhost:4200")
public class BackpackController {

    private final BackpackService backpackService;

    public BackpackController(BackpackService backpackService) {
        this.backpackService = backpackService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBackpack(
            @Valid @RequestPart("request") BackpackRequestDTO requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            BackpackDetailsDTO createdBackpack = backpackService.createBackpack(requestDTO, image);
            return new ResponseEntity<>(createdBackpack, HttpStatus.CREATED);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File upload error");
        }
    }


    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateBackpack(
            @PathVariable Long id,
            @Valid @RequestPart("request") BackpackRequestDTO requestDTO,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        try {
            return ResponseEntity.ok(backpackService.updateBackpack(id, requestDTO, image));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("File update error");
        }
    }

    @GetMapping
    public ResponseEntity<List<BackpackListDTO>> getAllBackpacks() {
        try {
            return ResponseEntity.ok(backpackService.getAllBackpacks());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBackpackById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(backpackService.getBackpackById(id));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBackpack(@PathVariable Long id) {
        try {
            backpackService.deleteBackpack(id);
            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.notFound().build();
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}