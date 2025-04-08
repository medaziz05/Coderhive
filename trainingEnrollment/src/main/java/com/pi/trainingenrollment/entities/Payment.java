package com.pi.trainingenrollment.entities;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "participant_id")
    private Participant participant;


    private double amount;

    @Enumerated(EnumType.STRING)
    private Currency currency;

    private LocalDateTime paymentDate;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Currency {
        TND, USD, EUR
    }

    public enum PaymentMethod {
        STRIPE, PAYPAL, BANK_TRANSFER
    }

    public enum Status {
        PENDING, COMPLETED, FAILED
    }
}
