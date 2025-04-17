package com.codingfactory.course_management.ServiceQuiz;

import java.io.IOException;
import java.util.stream.Collectors;

import co.elastic.clients.elasticsearch.ElasticsearchClient;
import com.codingfactory.course_management.DTOSQuiz.SearchDTO;
import com.codingfactory.course_management.elasticsearch.QuizDocument;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.mapping.IndexCoordinates;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.data.elasticsearch.core.query.Query;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class QuizSearchService {

    private static final String QUIZ_INDEX_NAME = "quiz_index";

    private final ElasticsearchOperations elasticsearchOperations;
    private final ElasticsearchClient elasticsearchClient;

    /**
     * Uses search parameters provided to find the quizzes that match
     *
     * @param searchDto DTO containing search parameters
     * @return search hits
     */
    public Page<QuizDocument > processSearch(SearchDTO searchDto) {
        Criteria criteria = buildCriteria(searchDto);
        Query searchQuery = new CriteriaQuery(criteria);

        if (searchDto.getSortByCreatedDate() != null) {
            searchQuery.addSort(Sort.by(searchDto.getSortByCreatedDate(), "created"));
        }

        if (searchDto.getSortByDifficulty() != null) {
            searchQuery.addSort(Sort.by(searchDto.getSortByDifficulty(), "_difficulty"));
        }

        Pageable pageable;
        if (searchDto.getPage() != null && searchDto.getSize() != null) {
            pageable = Pageable.ofSize(searchDto.getSize()).withPage(searchDto.getPage());
            searchQuery.setPageable(pageable);
        } else {
            pageable = Pageable.unpaged();
        }

        SearchHits<QuizDocument > quizzes = elasticsearchOperations
                .search(searchQuery,
                        QuizDocument .class,
                        IndexCoordinates.of(QUIZ_INDEX_NAME));

        return new PageImpl<>(quizzes.get().map(SearchHit::getContent).collect(Collectors.toList()), pageable,
                (int) quizzes.getTotalHits());

    }

    public Criteria buildCriteria(SearchDTO searchDto) {
        Criteria criteria = new Criteria("title");
        if (searchDto.getTitle() != null) {
            criteria.matches("*%s*".formatted(searchDto.getTitle()));
        }

        if (searchDto.getCategoryName() != null) {
            criteria.and(new Criteria("categoryName").is(searchDto.getCategoryName()));
        }

        if (searchDto.getChapterId() != null) {
            criteria.and("chapterId").is(searchDto.getChapterId());
        }

        if (searchDto.getNumberOfQuestions() != null) {
            criteria.and(new Criteria("questions").is(searchDto.getNumberOfQuestions()));
        }

        if (searchDto.getDifficulty() != null) {
            criteria.and(new Criteria("difficulty").is(searchDto.getDifficulty()));
        }

        return criteria;
    }


    /**
     * Creates a quiz index to make search easy later
     *
     * @param quiz the elastic quiz document to save
     * @return the id of the persisted doc
     */
    public String createQuizIndex(QuizDocument quiz) {
        try {
            return elasticsearchClient.index(i -> i
                    .index("quiz_index")
                    .id(quiz.getId().toString())
                    .document(quiz)
            ).id();
        } catch (IOException e) {
            throw new RuntimeException("Failed to index quiz", e);
        }
    }
}