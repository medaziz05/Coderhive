package com.complaint.entities;

import lombok.Data;

@Data
public class StatisticsDTO {
    private long totalComplaints;
    private long pendingCount;
    private long solvedCount;
    private long declinedCount;
    private double resolutionRate;
}