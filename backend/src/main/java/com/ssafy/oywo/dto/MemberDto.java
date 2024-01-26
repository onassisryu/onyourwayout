package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Member;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;


import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


public class MemberDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private String nickname;                    // 이름
        private String username;                // 사용자 이메일
        private String password;                // 비밀번호

        private String inviteCode;              // 인증 코드

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private java.sql.Date birthDate;                 // 생년월일
        private String phoneNumber;            // 전화번호
        private String apartCertificateImg;  // 아파트 증명 이미지

        public Member toEntity(){
            Member member=Member.builder()
                    .nickname(nickname)
                    .username(username)
                    .password(password)
                    .birthDate(birthDate)
                    .phoneNumber(phoneNumber)
                    .createdAt(new Timestamp(System.currentTimeMillis()))
                    .isCertified(false)
                    .score(50)              // 기본값 50
                    .certificationImg(apartCertificateImg)
                    .build();

            return member;
        }
    }

    @Getter
    public static class Response{
        private Long id;
        private String nickname;
        private String username;
        private Date birthDate;
        private String phoneNumber;
        private int score;
        //private List<String> roles=new ArrayList<>();
        private List<String> roles=new ArrayList<>();
        public Response(Member member){
            this.id=member.getId();
            this.nickname=member.getNickname();
            this.username=getUsername();
            this.birthDate=member.getBirthDate();
            this.phoneNumber=member.getPhoneNumber();
            this.score=member.getScore();
            this.roles=member.getRoles();
        }
    }
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignUp{
        private String nickname;                    // 이름
        private String username;                // 사용자 이메일
        private String password;                // 비밀번호

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private Date birthDate;                 // 생년월일

        private String phoneNumber;            // 전화번호
        private String apartCertificateImg;  // 아파트 증명 이미지
        private List<String> roles=new ArrayList<>();

        public Member toEntity(MemberDto.Request req,List<String> roles){
            Member member=Member.builder()
                    .nickname(req.getNickname())
                    .username(req.getUsername())
                    .password(req.getPassword())
                    .birthDate(req.getBirthDate())
                    .phoneNumber(req.getPhoneNumber())
                    .createdAt(new Timestamp(System.currentTimeMillis()))
                    .isCertified(false)
                    .score(50)              // 기본값 50
                    .certificationImg(req.getApartCertificateImg())
                    .roles(roles)
                    .build();

            return member;
        }
    }

}
