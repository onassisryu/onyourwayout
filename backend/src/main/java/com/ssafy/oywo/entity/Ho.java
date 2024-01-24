package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="ho")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Ho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne(cascade = CascadeType.REMOVE)
    @JoinColumn(name="dong_id")
    private Dong dongId;

    @Column(name="name")
    private String name;    // 호 이름

    @Column(name="invite_code")
    private String inviteCode;  // 초대 코드
}
