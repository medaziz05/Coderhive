package com.codingfactory.course_management;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.retry.annotation.EnableRetry;

@EnableRetry
@SpringBootApplication()
@EntityScan(basePackages = "com.codingfactory.course_management.entity")
public class CourseManagementApplication {

	public static void main(String[] args) {
		SpringApplication.run(CourseManagementApplication.class, args);
	}
	@Bean
	public Jackson2ObjectMapperBuilder objectMapperBuilder() {
		return new Jackson2ObjectMapperBuilder()
				.serializationInclusion(JsonInclude.Include.NON_NULL)
				.featuresToEnable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
	}
	@PostConstruct
	public void disableXXE() {
		System.setProperty("javax.xml.parsers.SAXParserFactory",
				"com.sun.org.apache.xerces.internal.jaxp.SAXParserFactoryImpl");
		System.setProperty("org.docx4j.jaxb.xml.allowExternalEntities", "false");
	}
}
