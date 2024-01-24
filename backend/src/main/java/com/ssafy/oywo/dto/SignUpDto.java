package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Member;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpDto {
    private String username;            // 사용자 이메일
    private String name;                // 사용자 이름
    private String password;            // 비밀번호

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date birthDate;             // 생년월일

    private String phoneNumber;         // 전화번호
    private String inviteCode;          // 초대 코드
    private String areaCode;            // 법정동 코드
    private String apartId;             // 아파트 아이디
    private String dongId;              // 동
    private String ho;                  // 호
    private String apartCertificateImg; // 아파트 증명 이미지

    private List<String> roles=new ArrayList<>();


    public Member toEntity(String encodedPassword){
        return Member.builder()
                .username(username)
                .password(password)
                .birthDate(birthDate)
                .phoneNumber(phoneNumber)
                .build();
    }
}
