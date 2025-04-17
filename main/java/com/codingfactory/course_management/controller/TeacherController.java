package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.Service.TeacherService;
import com.codingfactory.course_management.entity.Teacher;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/teachers")
@Tag(name = "Teachers", description = "Manage teachers")
public class TeacherController {

    private static final Logger logger = LoggerFactory.getLogger(TeacherController.class);
    private final TeacherService teacherService;

    public TeacherController(TeacherService teacherService) {
        this.teacherService = teacherService;
    }
    @PostMapping("/add")
    public ResponseEntity<?> addTeacher(@Valid @RequestBody Teacher teacher) {
        System.out.println("Received teacher: ID = " + teacher.getTeacherId() + ", Name = " + teacher.getName() + ", Speciality = " + teacher.getSpeciality());

        Teacher savedTeacher = teacherService.addTeacher(teacher);
        return ResponseEntity.ok(savedTeacher);
    }
}