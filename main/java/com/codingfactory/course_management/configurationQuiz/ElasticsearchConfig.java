package com.codingfactory.course_management.configurationQuiz;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.json.jackson.JacksonJsonpMapper;
import co.elastic.clients.transport.ElasticsearchTransport;
import co.elastic.clients.transport.rest_client.RestClientTransport;
import org.apache.http.HttpHost;
import org.apache.http.auth.AuthScope;
import org.apache.http.auth.UsernamePasswordCredentials;
import org.apache.http.client.CredentialsProvider;
import org.apache.http.conn.ssl.TrustAllStrategy;
import org.apache.http.impl.client.BasicCredentialsProvider;
import org.apache.http.ssl.SSLContextBuilder;
import org.elasticsearch.client.RestClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.net.ssl.SSLContext;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyStore;

@Configuration
public class ElasticsearchConfig {

    @Value("${spring.elasticsearch.uris}")
    private String elasticsearchUri;

    @Value("${spring.elasticsearch.username}")
    private String username;

    @Value("${spring.elasticsearch.password}")
    private String password;

    @Value("${truststore.path}")
    private String truststorePath;

    @Value("${truststore.password}")
    private String truststorePassword;

    @Bean
    public ElasticsearchClient elasticsearchClient() throws Exception {
        final CredentialsProvider credentialsProvider = new BasicCredentialsProvider();
        credentialsProvider.setCredentials(
                AuthScope.ANY,
                new UsernamePasswordCredentials(username, password)
        );

        SSLContext sslContext = createSSLContext();

        RestClient restClient = RestClient.builder(HttpHost.create(elasticsearchUri))
                .setHttpClientConfigCallback(httpClientBuilder -> {
                    httpClientBuilder
                            .setSSLContext(sslContext)
                            .setDefaultCredentialsProvider(credentialsProvider);
                    return httpClientBuilder;
                })
                .build();

        ElasticsearchTransport transport = new RestClientTransport(
                restClient,
                new JacksonJsonpMapper()
        );

        return new ElasticsearchClient(transport);
    }

    private SSLContext createSSLContext() throws Exception {
        KeyStore truststore = KeyStore.getInstance(KeyStore.getDefaultType());
        try (InputStream is = Files.newInputStream(Paths.get(truststorePath))) {
            truststore.load(is, truststorePassword.toCharArray());
        }

        return SSLContextBuilder.create()
                .loadTrustMaterial(truststore, null)
                .build();
    }
}