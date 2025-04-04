package com.codingfactory.course_management.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${libreoffice.path}")
    private String libreOfficePath;private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);


    public String storeFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.contains("..")) {
            throw new SecurityException("Invalid file name");
        }

        String fileName = StringUtils.cleanPath(originalFilename);
        String fileExtension = FilenameUtils.getExtension(fileName).toLowerCase();

        // Validate file type using extension (more reliable than content-type)
        List<String> allowedExtensions = Arrays.asList("pdf", "doc", "docx", "txt", "ppt", "pptx", "xls", "xlsx");
        if (!allowedExtensions.contains(fileExtension)) {
            throw new IllegalArgumentException("Invalid file type. Allowed types: " + allowedExtensions);
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 10MB limit");
        }

        Path targetDir = Paths.get(uploadDir).resolve("attachments");
        Files.createDirectories(targetDir);

        String newFileName = UUID.randomUUID() + "." + fileExtension;
        Path targetLocation = targetDir.resolve(newFileName);

        try (InputStream inputStream = file.getInputStream()) {
            Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Handle DOCX conversion with improved error handling
            if ("docx".equalsIgnoreCase(fileExtension)) {
                try {
                    String pdfFileName = convertDocxToPdf(targetLocation);
                    return newFileName + "|" + pdfFileName;
                } catch (Exception e) { // Catch all conversion errors
                    logger.error("DOCX to PDF conversion failed for: {}. Storing original only. Error: {}",
                            newFileName, e.getMessage());
                    // Fallback: Store just the DOCX file without PDF preview
                    return newFileName;
                }
            }

            // For PDF files: explicitly return single filename (preview same as original)
            return newFileName;
        }
    }

    private String  convertDocxToPdf(Path docxPath) throws IOException, InterruptedException {
        Path pdfPath = docxPath.resolveSibling(
                docxPath.getFileName().toString().replace(".docx", ".pdf")
        );

        ProcessBuilder pb = new ProcessBuilder(
                libreOfficePath,
                "--headless",
                "--convert-to", "pdf",
                "--outdir", pdfPath.getParent().toString(),
                docxPath.toString()
        );

        // Handle process output streams to prevent blocking
        Process process = pb.start();
        StreamGobbler outputGobbler = new StreamGobbler(process.getInputStream(), "OUTPUT");
        StreamGobbler errorGobbler = new StreamGobbler(process.getErrorStream(), "ERROR");
        outputGobbler.start();
        errorGobbler.start();

        int exitCode = process.waitFor();
        outputGobbler.join();
        errorGobbler.join();

        if (exitCode != 0) {
            throw new IOException("LibreOffice conversion failed with code: " + exitCode);
        }

        if (!Files.exists(pdfPath)) {
            throw new IOException("PDF output not found at: " + pdfPath);
        }
        return pdfPath.getFileName().toString();
    }

    private static class StreamGobbler extends Thread {
        private final InputStream inputStream;
        private final String type;

        StreamGobbler(InputStream inputStream, String type) {
            this.inputStream = inputStream;
            this.type = type;
        }

        @Override
        public void run() {
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    System.out.println(type + "> " + line);
                }
            } catch (IOException e) {
                System.err.println("Error reading " + type + " stream: " + e.getMessage());
            }
        }
    }


    public void deleteFile(String filePath) throws IOException {
        Path uploadPath = Paths.get(uploadDir).resolve("attachments").normalize();
        Path targetPath = uploadPath.resolve(filePath.split("\\|")[0]).normalize();

        // Validate file path to prevent directory traversal attacks
        if (!targetPath.startsWith(uploadPath)) {
            throw new SecurityException("Invalid file path: " + filePath);
        }

        // Delete original file
        Files.deleteIfExists(targetPath);

        // Delete corresponding PDF if exists
        if (filePath.contains("|")) {
            String pdfPath = filePath.split("\\|")[1]; // Extract PDF filename
            Path pdfTarget = uploadPath.resolve(pdfPath).normalize();

            // Ensure the PDF path is within the allowed directory
            if (pdfTarget.startsWith(uploadPath)) {
                Files.deleteIfExists(pdfTarget);
            } else {
                throw new SecurityException("Invalid PDF file path: " + pdfPath);
            }
        }
    }

}
