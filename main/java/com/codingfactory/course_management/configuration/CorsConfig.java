package com.codingfactory.course_management.configuration;

import com.codingfactory.course_management.configurationQuiz.ApplicationProperties;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Value("${upload.path}")
    private String uploadPath;

    @Value("${application.quiz-photos-path}")
    private String quizPhotosPath;

    private final ApplicationProperties applicationProperties;

    public CorsConfig(ApplicationProperties applicationProperties) {
        this.applicationProperties = applicationProperties;
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:4200")
                .allowedMethods("*")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

}