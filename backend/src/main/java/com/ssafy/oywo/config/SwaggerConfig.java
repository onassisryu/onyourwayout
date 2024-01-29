package com.ssafy.oywo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.OpenAPI;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI openAPI(){
        Info info = new Info()
                .title("나온김에 API")
                .description("나온김에 API 명세서")
                .version("v1");

        return new OpenAPI().info(info).components(new Components());
    }

}
