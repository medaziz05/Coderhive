package com.codingfactory.course_management.elasticsearch;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import java.time.LocalDateTime;

@Document(indexName = "quiz_index")
@Getter
@Setter
@Builder

public class QuizDocument {

    @Id
    private Long id;

    @Field
    private String title;

    @Field
    private Integer questions;

    @Field(type = FieldType.Text)
    private String categoryName;

    @Field
    private String uniqueCode;

    @Field(type = FieldType.Keyword)
    private String difficulty;

    @Field(type = FieldType.Long)
    private Long chapterId;


    @Field
    private Integer _difficulty;

    @Field(type = FieldType.Date, format = DateFormat.date_hour_minute_second)
    private LocalDateTime created;

}
    
    

   