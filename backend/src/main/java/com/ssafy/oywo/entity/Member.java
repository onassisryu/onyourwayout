package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "members")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
@EqualsAndHashCode(of="id")
public class Member implements UserDetails {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @Column(name="email", nullable = false)
    private String username;                // 사용자 이메일

    @Column(name="pwd", nullable = false)
    private String password;                // 비밀번호

    @Column(name="birth_date", nullable = false)
    private Date birthDate;                 // 생년월일

    @Column(name="phone_number", nullable = false)
    private String phoneNumber;            // 전화번호

    @Column(name="score")
    private int score;                      // 점수

    @Column(name="fcm_token")
    private String fcmToken;                // fcm 토큰

    @Column(name="penalty_count")
    private int penaltyCount;               // 패널티 누적 수

    @Column(name="pause_start_time")
    private Date pauseStartTime;            // 정지 시작 시간

    @Column(name="pause_end_time")
    private Date pauseEndTime;              // 정지 종료 시간

    @Column(name="start_alarm")
    private Date startAlarm;                // 알람 시작 시간

    @Column(name="end_alarm")
    private Date endAlarm;                  // 알람 끝 시간


    @Column(name="is_certificated")
    private boolean isCertificated;         // 인증 사용자 여부

    @Column(name="noti_dong_all")
    private boolean notiDongAll;            // 모든 동 알림

    @Column(name="noti_category_all")
    private boolean notiCategoryAll;        // 모든 카테고리 알림

    @Column(name="created_at")
    private Date createdAt;              // 생성 시간

    @Column(name="modified_at")
    private Date modifiedAt;             // 수정 시간

    @Column(name="deleted_at")
    private Date deletedAt;              // 삭제 시간

    @Column(name="apart_certificate_img")
    private String apartCertificateImg;  // 아파트 증명 이미지


    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<String> roles = new ArrayList<>();
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}