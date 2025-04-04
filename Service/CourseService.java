package com.codingfactory.course_management.Service;

import com.codingfactory.course_management.DTOS.*;
import com.codingfactory.course_management.Repository.ChapterRepository;
import com.codingfactory.course_management.Repository.TeacherRepository;
import com.codingfactory.course_management.configuration.ResourceNotFoundException;
import com.codingfactory.course_management.entity.ChapterAttachment;
import com.codingfactory.course_management.entity.Course;
import com.codingfactory.course_management.entity.Teacher;
import com.codingfactory.course_management.Repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import com.codingfactory.course_management.entity.Chapter;  // Ensure that this import is present

import com.codingfactory.course_management.DTOS.ChapterListDTO;  // Import for ChapterListDTO
import com.codingfactory.course_management.DTOS.ChapterDetailsDTO;  // Import for ChapterDetailsDTO
import com.codingfactory.course_management.DTOS.AttachmentDTO;  // Im



import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    @Autowired
    private ChapterRepository chapterRepository;

    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private TeacherRepository teacherRepository;

    private ChapterService chapterService;

    private final FileStorageService fileStorageService;
    private final TeacherService teacherService;

    @Value("${upload.path}")
    private String uploadDir;

    @Value("${api.base.url}")
    private String apiBaseUrl;

    @Autowired
    public CourseService(CourseRepository courseRepository, TeacherRepository teacherRepository, ChapterRepository chapterRepository, ChapterService chapterService, FileStorageService fileStorageService, TeacherService teacherService) {
        this.courseRepository = courseRepository;
        this.teacherRepository = teacherRepository;
        this.chapterRepository = chapterRepository;
        this.chapterService = chapterService;
        this.fileStorageService = fileStorageService;
        this.teacherService = teacherService;
    }


    @Transactional
    public Course addCourse(CourseRequestDTO courseRequestDTO, MultipartFile courseImage) {
        Teacher teacher = teacherRepository.findById(1L)
                .orElseThrow(() -> new RuntimeException("Teacher not found"));

        // Create a new Course object and set its attributes
        Course course = new Course();
        course.setCourseTitle(courseRequestDTO.getCourseTitle());
        course.setCourseCategory(courseRequestDTO.getCourseCategory());
        course.setCourseDescription(courseRequestDTO.getCourseDescription());
        course.setCoursePaid(courseRequestDTO.isCoursePaid());
        course.setLevel(courseRequestDTO.getLevel());

        // Handle image upload if the image is provided
        if (courseImage != null) {
            // Generate a unique filename using the current timestamp and original filename
            String fileName = System.currentTimeMillis() + "_" + courseImage.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            // Save the image file to the server
            try {
                Files.copy(courseImage.getInputStream(), filePath);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image", e);
            }

            // Store the relative path to the image (for serving via static resources)
            course.setCourseImage(apiBaseUrl + "/uploads/" + fileName);
        }

        // Associate teacher, set created/updated timestamps
        course.setTeacher(teacher);
        course.setCourseCreatedAt(LocalDateTime.now());
        course.setCourseUpdatedAt(LocalDateTime.now());

        // Save the course and return it
        return courseRepository.save(course);
    }



    public CourseDetailsDTO getCourseById(Long courseId) {
        Optional<Course> course = courseRepository.findCourseWithDetails(courseId);
        if (course.isPresent()) {
            Course c = course.get();

            // Convert the course entity to CourseDetailsDTO by passing individual values
            return new CourseDetailsDTO(
                    c.getCourseId(),
                    c.getCourseTitle(),
                    c.getCourseDescription(),
                    c.getCourseCategory(),
                    c.isCoursePaid(),
                    c.getLevel().name(), // Assuming level is an enum
                    c.getCourseImage(),
                    c.getCourseCreatedAt(),
                    c.getCourseUpdatedAt(),
                    new TeacherSimpleDTO(c.getTeacher().getTeacherId(), c.getTeacher().getName()), // Convert Teacher to DTO
                    c.getChapters().stream()
                            .map(chapter -> new ChapterListDTO(chapter.getChapterId(), chapter.getChapterTitle(), chapter.getChapterOrder())) // Convert chapters to DTO
                            .collect(Collectors.toList())
            );
        } else {
            throw new ResourceNotFoundException("Course not found with id: " + courseId);
        }
    }
    // ✅ Update course (excluding teacher and timestamps)
    @Transactional
    public CourseDetailsDTO updateCourse(Long id, CourseRequestDTO updatedCourse, MultipartFile courseImage) {
        // Fetch the course from the database
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update course fields
        existingCourse.setCourseTitle(updatedCourse.getCourseTitle());
        existingCourse.setCourseCategory(updatedCourse.getCourseCategory());
        existingCourse.setCourseDescription(updatedCourse.getCourseDescription());
        existingCourse.setCoursePaid(updatedCourse.isCoursePaid());
        existingCourse.setLevel(updatedCourse.getLevel());

        // If an image is provided, save it and update the image path
        if (courseImage != null) {
            String fileName = System.currentTimeMillis() + "_" + courseImage.getOriginalFilename();
            Path filePath = Paths.get(uploadDir, fileName);

            try {
                // Save the image file to the server
                Files.copy(courseImage.getInputStream(), filePath);
            } catch (IOException e) {
                throw new RuntimeException("Error saving image", e);
            }

            // Update the image path
            existingCourse.setCourseImage(apiBaseUrl + "/uploads/" + fileName);
        }

        // Set the updated time for the course
        existingCourse.setCourseUpdatedAt(LocalDateTime.now());
        courseRepository.save(existingCourse);


        return new CourseDetailsDTO(
                existingCourse.getCourseId(),
                existingCourse.getCourseTitle(),
                existingCourse.getCourseDescription(),
                existingCourse.getCourseCategory(),
                existingCourse.isCoursePaid(),
                existingCourse.getLevel().name(), // Assuming level is an Enum
                existingCourse.getCourseImage(),
                existingCourse.getCourseCreatedAt(),
                existingCourse.getCourseUpdatedAt(),
                new TeacherSimpleDTO(existingCourse.getTeacher().getTeacherId(), existingCourse.getTeacher().getName()), // Convert Teacher to DTO
                existingCourse.getChapters().stream()
                        .map(chapter -> new ChapterListDTO(chapter.getChapterId(), chapter.getChapterTitle(), chapter.getChapterOrder())) // Convert chapters to DTO
                        .collect(Collectors.toList())
        );
    }




    private CourseDTO convertToDTO(Course course) {
        // Ensure you're passing the course entity to the DTO constructor
        return new CourseDTO(course);
    }

    public List<ChapterListDTO> getChaptersByCourseId(Long courseId) {
        return chapterRepository.findByCourse_CourseId(courseId).stream()
                .map(chapter -> new ChapterListDTO(
                        chapter.getChapterId(),
                        chapter.getChapterTitle(),
                        chapter.getChapterOrder()
                ))
                .collect(Collectors.toList());
    }


    private CourseDetailsDTO convertToDetailsDTO(Course course) {
        // Create TeacherSimpleDTO from teacher (assuming course.getTeacher() is not null)
        TeacherSimpleDTO teacherDTO = new TeacherSimpleDTO(course.getTeacher().getTeacherId(), course.getTeacher().getName());

        // Convert the List of Chapters without attachments
        List<ChapterListDTO> chapterListDTO = course.getChapters().stream()
                .map(chapter -> new ChapterListDTO(
                        chapter.getChapterId(),
                        chapter.getChapterTitle(),
                        chapter.getChapterOrder()))
                .collect(Collectors.toList()); // 'collect' is fine, the suggestion was for converting to a toList()

        // Now return CourseDetailsDTO with all individual fields, not the entire course object
        return new CourseDetailsDTO(
                course.getCourseId(),
                course.getCourseTitle(),
                course.getCourseDescription(),
                course.getCourseCategory(),
                course.isCoursePaid(),
                course.getLevel().name(), // Assuming 'level' is an Enum, otherwise adjust
                course.getCourseImage(),
                course.getCourseCreatedAt(),
                course.getCourseUpdatedAt(),
                teacherDTO,
                chapterListDTO
        );
    }

    public ChapterDetailsDTO getChapterDetailsById(Long chapterId) {
        Chapter chapter = chapterRepository.findByIdWithAttachments(chapterId)
                .orElseThrow(() -> new RuntimeException("Chapter not found"));

        return new ChapterDetailsDTO(
                chapter.getChapterId(),
                chapter.getChapterTitle(),
                chapter.getChapterDescription(),
                chapter.getChapterOrder(),
                chapter.getChapterCreatedAt(),
                chapter.getChapterUpdatedAt(),
                chapter.getCourse().getCourseId(),
                chapter.getAttachments().stream()
                        .map(this::convertAttachmentToDTO)
                        .collect(Collectors.toList())
        );
    }


    @Transactional(readOnly = true)
    public CourseDetailsDTO getCourseDetailsById(Long id) {
        Course course = courseRepository.findCourseWithDetails(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return convertToDetailsDTO(course);
    }
    // ✅ Get all courses
    public List<CourseListDTO> getAllCourses() {
        return courseRepository.findAllCourseListItems();
    }

    // ✅ Delete course
    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }

    // ✅ convert chapter attachment to dto
    public AttachmentDTO convertAttachmentToDTO(ChapterAttachment attachment) {
        AttachmentDTO dto = new AttachmentDTO();
        dto.setFileName(attachment.getFileName());
        dto.setFileType(attachment.getFileType());
        dto.setUploadedAt(attachment.getUploadedAt());
        return dto;
    }
}
