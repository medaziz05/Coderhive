package com.codingfactory.course_management.entity;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "teachers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "teacher_id") // Keeps the database column name consistent
        private Long teacherId;  // Use camelCase in Java


        @Column(nullable = false)
        @NotBlank(message = "Name cannot be empty")
        @JsonProperty("name") // 🔹 Ensures JSON correctly maps this field
        private String name;

        @Column(nullable = false)
        @NotBlank(message = "Speciality cannot be empty")
        @JsonProperty("speciality") // 🔹 Ensures JSON correctly maps this field
        private String speciality;


        public Long getTeacherId() {
                return teacherId;
        }

        public void setTeacherId(Long teacherId) {
                this.teacherId = teacherId;
        }

        public String getName() {
                return name;
        }

        public void setName(String name) {
                this.name = name;
        }

        public String getSpeciality() {
                return speciality;
        }

        public void setSpeciality(String speciality) {
                this.speciality = speciality;
        }
}
