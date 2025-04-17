package com.codingfactory.course_management.controller;


import com.codingfactory.course_management.entity.Student;
import com.codingfactory.course_management.Service.StudentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/students")
@Tag(name = "Students", description = "Manage student accounts")
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend requests
public class StudentController {

    private final StudentService studentService;

    @Autowired
    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // ✅ Add a new student
    @PostMapping("/add")
    @Operation(summary = "Add a new student", description = "Creates a new student and returns the created entity.")
    public ResponseEntity<Student> addStudent(@RequestBody Student student) {
        Student savedStudent = studentService.addStudent(student);
        return ResponseEntity.ok(savedStudent);
    }

    @DeleteMapping("/delete/{studentId}")
    @Operation(summary = "Delete a student", description = "Deletes a student by their ID.")
    public ResponseEntity<?> deleteStudent(@PathVariable Long studentId) {
        try {
            studentService.deleteStudentById(studentId);
            return ResponseEntity.ok().body("✅ Student deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }


    @PutMapping("/update/{studentId}")
    @Operation(summary = "Update Student Membership", description = "Changes student membership status (paid or non-paid).")
    public ResponseEntity<?> updateStudent(@PathVariable Long studentId, @RequestBody Student student) {
        try {
            Student updatedStudent = studentService.updateStudent(studentId, student);
            return ResponseEntity.ok(updatedStudent);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    @PostMapping("/{studentId}/enroll/{courseId}")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long studentId, @PathVariable Long courseId) {
        try {
            studentService.enrollInCourse(studentId, courseId);
            return ResponseEntity.ok().body("✅ Student enrolled in course successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }




}
