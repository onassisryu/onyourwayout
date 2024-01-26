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
    @Column(name="uuid")
    private Long id;

    @Column(name="email",nullable = false)
    private String userName;

    @Column(nullable = false)
    private String refreshToken;

}
