    package com.complaint.controllers;


    import com.complaint.entities.*;
    import com.complaint.services.IComplaintService;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.format.annotation.DateTimeFormat;
    import org.springframework.http.HttpStatus;
    import org.springframework.http.ResponseEntity;
    import org.springframework.web.bind.annotation.*;

    import java.time.LocalDateTime;
    import java.util.List;
    import java.util.Optional;

    @RestController
    @RequestMapping("/api/complaints")
    @CrossOrigin(origins = "http://localhost:4200")
    public class ComplaintController {
        @Autowired
        private IComplaintService complaintService;

        @GetMapping
        public ResponseEntity<List<Complaintts>> getAllComplaints() {
            return ResponseEntity.ok(complaintService.getAllComplaints());
        }

        @GetMapping("/{id}")
        public ResponseEntity<Complaintts> getComplaintById(@PathVariable Integer id) {
            Optional<Complaintts> complaint = complaintService.getComplaintById(id);
            return complaint.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }

        @GetMapping("/status/{status}")
        public ResponseEntity<List<Complaintts>> getComplaintsByStatus(@PathVariable StatusCom status) {
            return ResponseEntity.ok(complaintService.getComplaintsByStatus(status));
        }

        @GetMapping("/mail/{mail}")
        public ResponseEntity<List<Complaintts>> getComplaintsByMail(@PathVariable String mail) {
            return ResponseEntity.ok(complaintService.getComplaintsByMail(mail));
        }
        @GetMapping("/anonymous")
        public ResponseEntity<List<Complaintts>> getAnonymousComplaints() {
            return ResponseEntity.ok(complaintService.getAnonymousComplaints());
        }

        @GetMapping("/non-anonymous")
        public ResponseEntity<List<Complaintts>> getNonAnonymousComplaints() {
            return ResponseEntity.ok(complaintService.getNonAnonymousComplaints());
        }

        @PostMapping
        public ResponseEntity<Complaintts> createComplaint(@RequestBody Complaintts complaint) {
            Complaintts newComplaint = complaintService.createComplaint(complaint);
            return ResponseEntity.status(HttpStatus.CREATED).body(newComplaint);
        }
        @PostMapping("/anonymous")
        public ResponseEntity<Complaintts> createAnonymousComplaint(@RequestBody Complaintts complaint) {
            Complaintts newComplaint = complaintService.createAnonymousComplaint(complaint);
            return ResponseEntity.status(HttpStatus.CREATED).body(newComplaint);
        }

        @PutMapping("/{id}")
        public ResponseEntity<Complaintts> updateComplaint(
                @PathVariable Integer id,
                @RequestBody Complaintts complaintDetails) {
            Complaintts updatedComplaint = complaintService.updateComplaint(id, complaintDetails);
            return updatedComplaint != null ?
                    ResponseEntity.ok(updatedComplaint) :
                    ResponseEntity.notFound().build();
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteComplaint(@PathVariable Integer id) {
            return complaintService.deleteComplaint(id) ?
                    ResponseEntity.ok().build() :
                    ResponseEntity.notFound().build();
        }

        @PutMapping("/{id}/solve")
        public ResponseEntity<Complaintts> markAsSolved(@PathVariable Integer id) {
            Complaintts solvedComplaint = complaintService.markAsSolved(id);
            return solvedComplaint != null ?
                    ResponseEntity.ok(solvedComplaint) :
                    ResponseEntity.notFound().build();
        }

        @GetMapping("/date-range")
        public ResponseEntity<List<Complaintts>> getComplaintsByDateRange(
                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
                @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
            return ResponseEntity.ok(complaintService.getComplaintsByDateRange(start, end));
        }

        @GetMapping("/recent")
        public ResponseEntity<List<Complaintts>> getRecentComplaints() {
            return ResponseEntity.ok(complaintService.getRecentComplaints());
        }

        @GetMapping("/type/{type}")
        public ResponseEntity<List<Complaintts>> getComplaintsByType(@PathVariable TypeCom type) {
            return ResponseEntity.ok(complaintService.getComplaintsByType(type));
        }

        @GetMapping("/count")
        public ResponseEntity<Long> getComplaintsCount() {
            return ResponseEntity.ok(complaintService.getComplaintsCount());
        }

        @GetMapping("/count/status/{status}")
        public ResponseEntity<Long> getComplaintsCountByStatus(@PathVariable StatusCom status) {
            return ResponseEntity.ok(complaintService.getComplaintsCountByStatus(status));
        }

        @PutMapping("/{id}/decline")
        public ResponseEntity<Complaintts> declineComplaint(@PathVariable Integer id) {
            Complaintts declinedComplaint = complaintService.declineComplaint(id);
            return declinedComplaint != null ?
                    ResponseEntity.ok(declinedComplaint) :
                    ResponseEntity.notFound().build();
        }
        @GetMapping("/statistics")
        public ResponseEntity<StatisticsDTO> getStatistics() {
            StatisticsDTO statistics = complaintService.statistiquesPlaintes();
            return ResponseEntity.ok(statistics);
        }
        @GetMapping("/filter")
        public List<Complaintts> filterComplaintsFromNewToOld(
                @RequestParam("newDate") String newDate,
                @RequestParam("oldDate") String oldDate) {
            LocalDateTime newDateTime = LocalDateTime.parse(newDate);
            LocalDateTime oldDateTime = LocalDateTime.parse(oldDate);
            return complaintService.getComplaintsFromNewToOld(newDateTime, oldDateTime);
        }
        @GetMapping("/search")
        public ResponseEntity<List<Complaintts>> searchComplaints(@RequestParam(required = false) String title) {
            List<Complaintts> results = complaintService.searchComplaintsByTitle(title);
            return ResponseEntity.ok(results);
        }

        @GetMapping("/priority/{priority}")
        public ResponseEntity<List<Complaintts>> getComplaintsByPriority(@PathVariable ComplaintPriority priority) {
            return ResponseEntity.ok(complaintService.getComplaintsByPriority(priority));
        }
    }
