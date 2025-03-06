package com.complaint.services;

import com.complaint.entities.Response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface IResponseService {
    List<Response> getAllResponses();

    Optional<Response> getResponseById(Integer id);

    List<Response> getResponsesByComplaintId(Integer idcomplaint);

    Response createResponse(Integer complaintId, Response response);

    Response updateResponse(Integer id, Response responseDetails);

    boolean deleteResponse(Integer id);

    List<Response> getResponsesByDateRange(LocalDateTime start, LocalDateTime end);

    List<Response> getRecentResponses();

    long countByComplaintts_Idcomplaint(Integer idcomplaint);

    double getAverageResponseTime();

    void statistiquesReponses();
}
