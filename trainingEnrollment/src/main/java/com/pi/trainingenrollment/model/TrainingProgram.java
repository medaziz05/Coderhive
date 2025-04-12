

package com.pi.trainingenrollment.model;

import lombok.Data;

@Data
public class TrainingProgram {
    private int id;
    private String title;
    private String description;
    private int duration;
    private double price;
}
