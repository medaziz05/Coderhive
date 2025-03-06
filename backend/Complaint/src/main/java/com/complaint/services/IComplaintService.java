package com.complaint.services;

import com.complaint.entities.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IComplaintService {
    List<Complaintts> getAllComplaints();

    Optional<Complaintts> getComplaintById(Integer id);

    List<Complaintts> getComplaintsByStatus(StatusCom status);

    List<Complaintts> getComplaintsByMail(String mail);

    Complaintts createComplaint(Complaintts complaint);
    Complaintts createAnonymousComplaint(Complaintts complaint);

    Complaintts updateComplaint(Integer id, Complaintts complaintDetails);

    Complaintts declineComplaint(Integer id);

    boolean deleteComplaint(Integer id);

    Complaintts markAsSolved(Integer id);

    List<Complaintts> getComplaintsByDateRange(LocalDateTime start, LocalDateTime end);
    List<Complaintts> getComplaintsFromNewToOld(LocalDateTime newDate, LocalDateTime oldDate);

    List<Complaintts> getRecentComplaints();

    List<Complaintts> searchComplaintsByTitle(String searchTerm);

    List<Complaintts> getComplaintsByType(TypeCom type);
    List<Complaintts> getAnonymousComplaints();

    List<Complaintts> getNonAnonymousComplaints();

    long getComplaintsCount();

    long getComplaintsCountByStatus(StatusCom status);

    List<Complaintts> getComplaintsByPriority(ComplaintPriority priority);

    StatisticsDTO statistiquesPlaintes();

}
