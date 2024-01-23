package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Builder
@Entity
@Getter
@ToString
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name="email",nullable = false)
    private String userName;

    @Column(name="refresh_token",nullable = false)
    private String refreshToken;

}
