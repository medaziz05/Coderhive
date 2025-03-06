package com.complaint.entities;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "Response")
@Getter
@Setter
public class Response {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idresponse;

    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "response_date")
    private LocalDateTime date = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "idcomplaint")
    @JsonIgnore
    private Complaintts complaintts;
    public int getIdresponse() {
        return idresponse;
    }

    public void setIdresponse(int idresponse) {
        this.idresponse = idresponse;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Complaintts getComplaintts() {
        return complaintts;
    }

    public void setComplaintts(Complaintts complaintts) {
        this.complaintts = complaintts;
    }

    // toString method
    @Override
    public String toString() {
        return "Response{" +
                "idresponse=" + idresponse +
                ", message='" + message + '\'' +
                ", date=" + date +
                ", complaintts=" + complaintts +
                '}';
    }


}
