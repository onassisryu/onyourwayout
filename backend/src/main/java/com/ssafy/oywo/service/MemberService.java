package com.ssafy.oywo.service;


import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;

import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.RefreshToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface MemberService {
    public JwtToken signIn(String username, String password);
    public MemberDto.Response signUp(MemberDto.Request memberDto);
    public Optional<RefreshToken> getRefreshToken(String refreshToken);
    public Map<String,String> validateRefreshToken(String refreshToken);
    public Member modify(MemberDto.Request memberDto);
    public void logout(String username);

    public Member modify(Member member);
    public Member modify(Long id, MemberDto.Request memberDto);
    public void logout(String username);

    public Member getMemberInfo(String username, String password);
    public Optional<Member> getMemberInfo(Long id);

<<<<<<< HEAD
=======
    public Optional<Member> update(Long idx,MemberDto.SignUp memberDto);

>>>>>>> fbffdff (Fix : 회원 정보 수정, 로그아웃, 초대 코드 생성)
}
