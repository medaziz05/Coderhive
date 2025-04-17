package com.codingfactory.course_management.RepositoryQuiz;

import com.codingfactory.course_management.elasticsearch.QuizDocument;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;
import org.springframework.stereotype.Repository;
@Repository
public interface QuizSearchRepository
        extends ElasticsearchRepository<QuizDocument, Long> {
}
