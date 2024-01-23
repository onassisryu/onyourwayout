package com.ssafy.oywo.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class SignInDto {
    private String username;            // 사용자 이메일
    private String password;            // 사용자 비밀번호
}
