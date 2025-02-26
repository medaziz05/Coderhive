package com.codingfactory.course_management.Service;

import com.codingfactory.course_management.DTOS.CourseDTO;
import com.codingfactory.course_management.Repository.StudentRepository;
import com.codingfactory.course_management.Repository.TeacherRepository;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.Repository.CourseRepository;
import com.codingfactory.course_management.entity.Teacher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeacherRepository teacherRepository;



    // ✅ Create a new course
    public Course createCourse(Course course) {
        Teacher teacher = teacherRepository.findById(1L) // Fetch teacher with ID 1
                .orElseThrow(() -> new RuntimeException("Teacher with ID 1 not found")); // If not found, throw an error

        course.setTeacher(teacher);  // Associate the teacher with the course

        // Set default image if not provided
        if (course.getCourseImage() == null || course.getCourseImage().isEmpty()) {
            course.setCourseImage("/uploads/default-course.png");
        }

        return courseRepository.save(course);  // Save and return the course
    }


    public List<CourseDTO> getAllCourses() {
        List<Course> courses = courseRepository.findAll();
        return courses.stream().map(course -> {
            CourseDTO dto = new CourseDTO();
            // Course basic info
            dto.setCourseId(course.getCourseId());
            dto.setCourseTitle(course.getCourseTitle());
            dto.setCourseCategory(course.getCourseCategory());
            dto.setCourseDescription(course.getCourseDescription());
            dto.setCoursePaid(course.isCoursePaid());
            dto.setLevel(course.getLevel());
            dto.setCoursePrice(course.getCoursePrice());
            dto.setCourseImage(course.getCourseImage());

            // Timestamps
            dto.setCourseCreatedAt(course.getCourseCreatedAt());
            dto.setCourseUpdatedAt(course.getCourseUpdatedAt());

            // Teacher info
            Teacher teacher = course.getTeacher();
            dto.setTeacherId(teacher.getTeacherId());
            dto.setTeacherName(teacher.getName());
            dto.setTeacherSpeciality(teacher.getSpeciality());

            return dto;
        }).collect(Collectors.toList());
    }


    public CourseDTO getCourseById(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Convert Course entity to CourseDTO
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(course.getCourseId());
        dto.setCourseTitle(course.getCourseTitle());
        dto.setCourseCategory(course.getCourseCategory());
        dto.setCourseDescription(course.getCourseDescription());
        dto.setCoursePaid(course.isCoursePaid());
        dto.setLevel(course.getLevel());
        dto.setCoursePrice(course.getCoursePrice());
        dto.setCourseImage(course.getCourseImage());
        dto.setCourseCreatedAt(course.getCourseCreatedAt());
        dto.setCourseUpdatedAt(course.getCourseUpdatedAt());
        Teacher teacher = course.getTeacher();
        dto.setTeacherId(teacher.getTeacherId());
        dto.setTeacherName(teacher.getName());
        dto.setTeacherSpeciality(teacher.getSpeciality());



        return dto;
    }

    public CourseDTO updateCourseById(Long courseId, Course courseDetails) {
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update fields
        existingCourse.setCourseTitle(courseDetails.getCourseTitle());
        existingCourse.setCourseCategory(courseDetails.getCourseCategory());
        existingCourse.setCourseDescription(courseDetails.getCourseDescription());
        existingCourse.setLevel(courseDetails.getLevel());
        existingCourse.setCoursePaid(courseDetails.isCoursePaid());
        existingCourse.setCourseImage(courseDetails.getCourseImage());
        existingCourse.setCoursePrice(courseDetails.getCoursePrice());
        existingCourse.setCourseUpdatedAt(LocalDateTime.now());

        Course updatedCourse = courseRepository.save(existingCourse);

        // Convert the updated Course entity to CourseDTO
        CourseDTO dto = new CourseDTO();
        dto.setCourseId(updatedCourse.getCourseId());
        dto.setCourseTitle(updatedCourse.getCourseTitle());
        dto.setCourseCategory(updatedCourse.getCourseCategory());
        dto.setCourseDescription(updatedCourse.getCourseDescription());
        dto.setCoursePaid(updatedCourse.isCoursePaid());
        dto.setLevel(updatedCourse.getLevel());
        dto.setCoursePrice(updatedCourse.getCoursePrice());
        dto.setCourseImage(updatedCourse.getCourseImage());
        dto.setCourseCreatedAt(updatedCourse.getCourseCreatedAt());
        dto.setCourseUpdatedAt(updatedCourse.getCourseUpdatedAt());

        // Add teacher details
        Teacher teacher = updatedCourse.getTeacher();
        dto.setTeacherId(teacher.getTeacherId());
        dto.setTeacherName(teacher.getName());
        dto.setTeacherSpeciality(teacher.getSpeciality());

        return dto;
    }


    public void deleteCourse(Long courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        courseRepository.delete(course);
    }



}
