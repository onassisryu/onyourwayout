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

    public Member modify(Member member);
    public Member modify(MemberDto.Request memberDto);
    public void logout(String username);

    public Member getMemberInfo(String username, String password);
    public Optional<Member> getMemberInfo(Long id);

    public Optional<Member> update(Long idx,MemberDto.SignUp memberDto);

}
