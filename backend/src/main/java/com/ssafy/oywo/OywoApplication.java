package com.ssafy.oywo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@EnableJpaAuditing
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class OywoApplication {

	public static void main(String[] args) {
		System.out.println("Hello World");

		SpringApplication.run(OywoApplication.class, args);
	}

}
