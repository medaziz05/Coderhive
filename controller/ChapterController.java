package com.codingfactory.course_management.controller;

import com.codingfactory.course_management.entity.Chapter;
import com.codingfactory.course_management.Service.ChapterService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chapters")
@Tag(name = "Chapters", description = "Manage course chapters")
@CrossOrigin(origins = "http://localhost:4200") // Allow frontend requests
public class ChapterController {

    private final ChapterService chapterService;

    @Autowired
    public ChapterController(ChapterService chapterService) {
        this.chapterService = chapterService;
    }

    // ✅ Add a new chapter
    @PostMapping("/add")
    @Operation(summary = "Add a new chapter", description = "Creates a new chapter and returns the created entity.")
    public ResponseEntity<Chapter> addChapter(@RequestBody Chapter chapter) {
        Chapter savedChapter = chapterService.addChapter(chapter);
        return ResponseEntity.ok(savedChapter);
    }

    // ✅ Update an existing chapter
    @PutMapping("/update/{chapterId}")
    @Operation(summary = "Update an existing chapter", description = "Updates the chapter with the provided ID.")
    public ResponseEntity<Chapter> updateChapter(@PathVariable Long chapterId, @RequestBody Chapter updatedChapter) {
        Chapter updated = chapterService.updateChapter(chapterId, updatedChapter);
        return ResponseEntity.ok(updated);
    }

    // ✅ Delete a chapter
    @DeleteMapping("/delete/{chapterId}")
    @Operation(summary = "Delete a chapter", description = "Deletes a chapter by its ID.")
    public ResponseEntity<?> deleteChapter(@PathVariable Long chapterId) {
        try {
            chapterService.deleteChapter(chapterId);
            return ResponseEntity.ok().body("✅ Chapter deleted successfully.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("❌ " + e.getMessage());
        }
    }

    // ✅ Get all chapters by course ID
    @GetMapping("/course/{courseId}")
    @Operation(summary = "Get all chapters for a course", description = "Fetches all chapters belonging to a course.")
    public ResponseEntity<List<Chapter>> getChaptersByCourse(@PathVariable Long courseId) {
        List<Chapter> chapters = chapterService.getChaptersByCourse(courseId);
        return ResponseEntity.ok(chapters);
    }

    // ✅ Get a single chapter by its ID
    @GetMapping("/{chapterId}")
    @Operation(summary = "Get a chapter by ID", description = "Fetches a specific chapter by its ID.")
    public ResponseEntity<Chapter> getChapterById(@PathVariable Long chapterId) {
        Chapter chapter = chapterService.getChapterById(chapterId);
        return ResponseEntity.ok(chapter);
    }
}
