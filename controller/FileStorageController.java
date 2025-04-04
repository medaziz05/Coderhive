package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.Repository.ChapterAttachmentRepository;
import com.codingfactory.course_management.entity.ChapterAttachment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.apache.commons.io.FilenameUtils;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:4200") // Add CORS if needed
public class FileStorageController {

    private final ChapterAttachmentRepository attachmentRepository;
    private final String uploadDir;

    @Autowired
    public FileStorageController(
            ChapterAttachmentRepository attachmentRepository,
            @Value("${file.upload-dir}") String uploadDir
    ) {
        this.attachmentRepository = attachmentRepository;
        this.uploadDir = uploadDir;
    }

    // Method to retrieve files from the server (for viewing)
    @GetMapping("/attachments/preview/{filename:.+}")
    public ResponseEntity<Resource> getPreviewFile(@PathVariable String filename) {
        try {
            validateFilename(filename);
            // 1. Find by preview file path instead of original file path
            Optional<ChapterAttachment> attachment = attachmentRepository.findByPreviewFilePath(filename);
            if (attachment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // 2. Directly use the requested filename for path resolution
            Path filePath = Paths.get(uploadDir)
                    .resolve("attachments")
                    .resolve(filename)
                    .normalize();

            if (!Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());


            return ResponseEntity.ok()
                    .header("Content-Security-Policy", "frame-ancestors 'self' http://localhost:4200")
                    .contentType(MediaType.APPLICATION_PDF)
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                    .body(resource);
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().build();
        }

    }
    private void validateFilename(String filename) throws UnsupportedEncodingException {
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            throw new SecurityException("Invalid filename: " + filename);
        }

        // Verify URL decoding doesn't change the filename
        String decoded = URLDecoder.decode(filename, StandardCharsets.UTF_8);
        if (!filename.equals(decoded)) {
            throw new SecurityException("Invalid filename encoding");
        }
    }

    // Method to determine the media type based on file extension
    private MediaType determineMediaType(String filename) {
        String extension = FilenameUtils.getExtension(filename).toLowerCase();
        return switch (extension) {
            case "pdf" -> MediaType.APPLICATION_PDF;
            case "txt" -> MediaType.TEXT_PLAIN;
            case "doc" -> MediaType.valueOf("application/msword");
            case "docx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            case "xls" -> MediaType.valueOf("application/vnd.ms-excel");
            case "xlsx" -> MediaType.valueOf("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            default -> MediaType.APPLICATION_OCTET_STREAM;
        };
    }
}
