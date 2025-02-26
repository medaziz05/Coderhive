package com.codingfactory.course_management.entity;

import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "student_id") // Maps to DB column "student_id"
    private Long studentId; // ✅ camelCase

    @Column(name = "student_name", nullable = false)
    private String studentName; // ✅ camelCase

    @Column(name = "student_membership", nullable = false)
    private boolean studentMembership; // ✅ camelCase

    @ManyToMany(mappedBy = "students") // ✅ Inverse side of the relationship
    private Set<Course> courses; // ✅ Many-to-many relationship with Course

    // Default constructor
    public Student() {}

    // Constructor with fields
    public Student(Long studentId, String studentName, boolean studentMembership) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentMembership = studentMembership;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public boolean isStudentMembership() {
        return studentMembership;
    }

    public void setStudentMembership(boolean studentMembership) {
        this.studentMembership = studentMembership;
    }

    public Set<Course> getCourses() {
        return courses;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
    }
}