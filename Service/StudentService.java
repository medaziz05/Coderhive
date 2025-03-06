package com.codingfactory.course_management.Service;

import com.codingfactory.course_management.Repository.CourseRepository;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Student;
import com.codingfactory.course_management.Repository.StudentRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class StudentService {
    @Autowired
    private CourseRepository courseRepository;

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // ✅ Add a new student
    public Student addStudent(Student student) {
        return studentRepository.save(student);
    }


    public void deleteStudentById(Long studentId) {
        if (studentRepository.existsById(studentId)) {
            studentRepository.deleteById(studentId);
        } else {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
    }


    public Student updateStudent(Long studentId, Student updatedStudent) {
        Optional<Student> studentOptional = studentRepository.findById(studentId);

        if (studentOptional.isPresent()) {
            Student existingStudent = studentOptional.get();

            // ✅ Corrected Method Name
            existingStudent.setStudentMembership(updatedStudent.isStudentMembership());

            return studentRepository.save(existingStudent);
        } else {
            throw new RuntimeException("Student not found with ID: " + studentId);
        }
    }


    @Transactional
    public void enrollInCourse(Long studentId, Long courseId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));

        student.getCourses().add(course); // ✅ Add course to the student's enrolled courses
        studentRepository.save(student); // ✅ Save the updated student
    }

    // ✅ Other methods (getStudentById, createStudent, etc.)
    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
    }

    public Student createStudent(Student student) {
        return studentRepository.save(student);
    }


}



