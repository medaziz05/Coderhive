package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.DTOS.*;
import com.codingfactory.course_management.Service.ChapterService;
import com.codingfactory.course_management.Service.CourseService;
import com.codingfactory.course_management.entity.Course;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.codingfactory.course_management.exception.ResourceNotFoundException;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Manage courses")
@CrossOrigin(origins = "http://localhost:4200")
public class CourseController {

    @Value("${upload.path}")
    private String uploadDir;

    private final CourseService courseService;
    private final ChapterService chapterService;


    // Constructor injection for courseService
    public CourseController(CourseService courseService, ChapterService chapterService) {
        this.courseService = courseService;
        this.chapterService = chapterService;
    }

    // ✅ Add Course
    @PostMapping("/add")
    public ResponseEntity<Course> addCourse(
            @Valid @RequestPart("courseRequest") CourseRequestDTO courseRequestDTO,
            @RequestPart(value = "file", required = false) MultipartFile courseImage) throws IOException {

        // Pass the DTO and image to the service to handle the image upload and course creation
        Course newCourse = courseService.addCourse(courseRequestDTO, courseImage);
        return new ResponseEntity<>(newCourse, HttpStatus.CREATED);
    }

    // ✅ Get All Courses
    @GetMapping("/list")
    public ResponseEntity<List<CourseListDTO>> getAllCourses() {
        try {
            List<CourseListDTO> courses = courseService.getAllCourses();
            return ResponseEntity.ok(courses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    // ✅ Get Course by ID
    @GetMapping("/{id}")
    public ResponseEntity<CourseDetailsDTO> getCourseById(@PathVariable Long id) {
        try {
            CourseDetailsDTO course = courseService.getCourseById(id);
            return ResponseEntity.ok(course);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/{courseId}/chapters")
    public ResponseEntity<List<ChapterListDTO>> getChaptersByCourseId(@PathVariable Long courseId) {
        try {
            List<ChapterListDTO> chapters = courseService.getChaptersByCourseId(courseId);  // Use the service method in CourseService
            return ResponseEntity.ok(chapters);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);  // Return 404 if no chapters found
        }
    }

    // ✅ Update Course
    @PutMapping("/{id}")
    public ResponseEntity<CourseDetailsDTO> updateCourse(
            @PathVariable Long id,
            @RequestPart("courseRequest") CourseRequestDTO updatedCourse,
            @RequestPart(value = "file", required = false) MultipartFile courseImage) throws IOException {

        // Call the service to update the course
        CourseDetailsDTO updatedCourseDetails = courseService.updateCourse(id, updatedCourse, courseImage);

        return new ResponseEntity<>(updatedCourseDetails, HttpStatus.OK);
    }

    // ✅ Delete Course
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.noContent().build(); // 204 No content
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

   // filter //
   @GetMapping("/filter")
   public ResponseEntity<List<Course>> getCourses(
           @RequestParam(value = "searchQuery", required = false) String searchQuery,
           @RequestParam(value = "category", required = false) String category,
           @RequestParam(value = "price", required = false) String price,
           @RequestParam(value = "level", required = false) String level) {

       List<Course> courses = courseService.getFilteredCourses(searchQuery, category, price, level);
       return ResponseEntity.ok(courses);
   }

}
