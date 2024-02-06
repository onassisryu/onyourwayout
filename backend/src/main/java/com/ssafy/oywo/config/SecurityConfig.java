package com.ssafy.oywo.config;

import com.ssafy.oywo.jwt.JwtAuthenticationFilter;
import com.ssafy.oywo.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception{
        return http
                // REST API이므로 basic auth 및 csrf 보안을 사용하지 않음
                .httpBasic().disable()
                .csrf().disable()
                // JWT를 사용하기 때문에 세션을 사용하지 않음
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .authorizeHttpRequests()
                // 해당 API에 대해서는 모든 요청을 허가
                .requestMatchers("/error").permitAll()
                .requestMatchers("/v3/**", "/swagger-ui/**", "/api-docs/**").permitAll()
                .requestMatchers("/members/signin").permitAll()
                .requestMatchers("/deal/**").permitAll()
                // USER 권한이 있어야 요청할 수 있음
                .requestMatchers("/members/signup").permitAll()
                .requestMatchers("/members/refresh").permitAll()
                .requestMatchers("/members/verify/**").permitAll()
                // apart에 대한 정보 요청은 모두 허가
                .requestMatchers(HttpMethod.GET,"/apart/**").permitAll()
                .requestMatchers("/pub/**").permitAll()
                .requestMatchers("/sub/**").permitAll()
                .requestMatchers("/members/dup/**").permitAll()
                // 이 밖에 모든 요청에 대해서 인증을 필요로 한다는 설정
                .anyRequest().authenticated()
                .and()
                // JWT 인증을 위하여 직접 구현한 필터를 UsernamePasswordAuthenticationFilter 전에 실행
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class).build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }
}
