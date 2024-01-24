package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Member;
import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MemberDto {

    private Long id;
    private String name;                    // 이름
    private String username;                // 사용자 이메일
    private String password;                // 비밀번호

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthDate;                 // 생년월일
    private String phoneNumber;            // 전화번호
    private int score;                      // 점수
    private String fcmToken;                // fcm 토큰
    private int penaltyCount;               // 패널티 누적 수
    private Date pauseStartTime;            // 정지 시작 시간
    private Date pauseEndTime;              // 정지 종료 시간
    private Date startAlarm;                // 알람 시작 시간
    private Date endAlarm;                  // 알람 끝 시간
    private int dealCount;                  // 거래 수
    private boolean isCertificated;         // 인증 사용자 여부
    private boolean notiDongAll;            // 모든 동 알림
    private boolean notiCategoryAll;        // 모든 카테고리 알림
    private Date createdAt;              // 생성 시간
    private Date modifiedAt;             // 수정 시간
    private Date deletedAt;              // 삭제 시간
    private String apartCertificateImg;  // 아파트 증명 이미지
    static public MemberDto toDto(Member member){
        return MemberDto.builder()
                .id(member.getId())
                .password(member.getPassword())
                .birthDate(member.getBirthDate())
                .phoneNumber(member.getPhoneNumber())
                .roles(member.getRoles())
                .build();
    }
    private List<String> roles=new ArrayList<>();

    public Member toEntity(){
        return Member.builder()
                .username(username)
                .password(password)
                .birthDate(birthDate)
                .phoneNumber(phoneNumber)
                .roles(roles)
                .build();
    }
}
