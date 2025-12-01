package com.example.backend.config;

import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.Type;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class RestConfig implements RepositoryRestConfigurer {

    @Autowired
    private EntityManager entityManager;

    private final String frontendURL = "http://localhost:5173";

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        // Thêm prefix /api cho tất cả endpoints
        config.setBasePath("/api");

        // Expose IDs cho tất cả entity
        config.exposeIdsFor(
                entityManager
                        .getMetamodel()
                        .getEntities()
                        .stream()
                        .map(Type::getJavaType)
                        .toArray(Class[]::new)
        );

        // Cấu hình CORS
        cors.addMapping("/**")
                .allowedOrigins(frontendURL)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
