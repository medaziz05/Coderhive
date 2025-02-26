package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.DTOS.CourseDTO;
import com.codingfactory.course_management.Service.CourseService;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Teacher;
import com.codingfactory.course_management.Repository.TeacherRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Manage courses")
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend requests
public class CourseController {

    private static final String UPLOAD_DIR = "uploads/";
    private final CourseService courseService;
    private final TeacherRepository teacherRepository; // ✅ Inject TeacherRepository to fetch teacher
    private static final Logger LOGGER = Logger.getLogger(CourseController.class.getName());

    public CourseController(CourseService courseService, TeacherRepository teacherRepository) {
        this.courseService = courseService;
        this.teacherRepository = teacherRepository;
    }

    // ✅ 1. Create a New Course
    @PostMapping("/add-course")
    @Operation(summary = "Add a new course", description = "Create and store a new course")
    public ResponseEntity<?> createCourse(@RequestBody Course course) {
        try {
            // ✅ Check if the teacher object is valid
            if (course.getTeacher() == null || course.getTeacher().getTeacherId() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("❌ Teacher details (including teacherId) are required.");
            }

            // Here, we're assuming the full teacher object is sent
            Teacher teacher = course.getTeacher();  // You now have the full Teacher object

            // Optionally, validate teacher's existence in the database (if needed)
            if (teacher.getTeacherId() != null) {
                Teacher existingTeacher = teacherRepository.findById(teacher.getTeacherId())
                        .orElseThrow(() -> new RuntimeException("❌ Teacher not found"));
                course.setTeacher(existingTeacher);  // Make sure the teacher is persisted correctly
            }

            // ✅ Validate image format if necessary
            if (course.getCourseImage() != null && course.getCourseImage().startsWith("data:image")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("❌ Invalid image format! The image should be uploaded and stored as a URL.");
            }

            Course createdCourse = courseService.createCourse(course);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCourse);
        } catch (Exception e) {
            LOGGER.severe("❌ Error creating course: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Failed to create course.");
        }
    }



    // ✅ 2. Get All Courses
    @GetMapping("/view-courses")
    @Operation(summary = "Get all courses", description = "Retrieve the full list of courses")
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        try {
            List<CourseDTO> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @GetMapping("/get/{courseId}")
    public ResponseEntity<?> getCourseById(@PathVariable Long courseId) {
        try {
            CourseDTO courseDTO = courseService.getCourseById(courseId);
            return ResponseEntity.ok(courseDTO);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found with ID: " + courseId);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to retrieve course: " + e.getMessage());
        }
    }

    // ✅ 4. Update an Existing Course
    @PutMapping("/update/{courseId}")
    @Operation(summary = "Update a course", description = "Modify an existing course using its ID")
    public ResponseEntity<?> updateCourse(@PathVariable Long courseId, @RequestBody Course courseDetails) {
        try {
            CourseDTO updatedCourse = courseService.updateCourseById(courseId, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Failed to update course.");
        }
    }

    // ✅ 5. Delete a Course
    @DeleteMapping("/delete/{courseId}")
    @Operation(summary = "Delete a course", description = "Remove a course using its ID")
    public ResponseEntity<?> deleteCourse(@PathVariable Long courseId) {
        try {
            courseService.deleteCourse(courseId);
            // Return proper JSON response
            return ResponseEntity.ok().body(Map.of("message", "Course deleted successfully"));
        } catch (Exception e) {
            LOGGER.severe("❌ Error deleting course: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete course"));
        }
    }

    // ✅ 6. Upload Course Image & Return URL
    @PostMapping("/upload-image")
    @Operation(summary = "Upload course image", description = "Uploads an image and returns its URL")
    public ResponseEntity<?> uploadCourseImage(@RequestParam("file") MultipartFile file) {
        try {
            // ✅ Ensure Upload Directory Exists
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            // ✅ Generate Unique File Name
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // ✅ Generate URL to Access the Uploaded Image
            String imageUrl = "http://localhost:8081/api/courses/uploads/" + fileName;

            return ResponseEntity.ok().body("{ \"imageUrl\": \"" + imageUrl + "\" }");

        } catch (IOException e) {
            LOGGER.severe("❌ Error uploading image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error uploading file.");
        }
    }
    // ✅ 7. Serve Uploaded Images
    @GetMapping("/uploads/{filename:.+}")
    @Operation(summary = "Serve uploaded images", description = "Retrieve uploaded course images")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR).resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok().body(resource);
            } else {
                return ResponseEntity.notFound().build(); // ✅ Correct way to return a 404 for a missing image
            }
        } catch (Exception e) {
            LOGGER.severe("❌ Error retrieving image: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build(); // ✅ Return 500 without a String body
        }
    }

}
