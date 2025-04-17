package com.codingfactory.course_management.DTOSQuiz;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Sort;

@Getter
@Setter
@Builder
public class SearchDTO {

    private String title;

    private Integer numberOfQuestions;

    private String difficulty;

    private String categoryName;

    private Integer size;

    private Integer page;

    private Long chapterId;

    private Sort.Direction sortByCreatedDate;

    private Sort.Direction sortByDifficulty;
}
