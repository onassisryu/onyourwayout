package com.ssafy.oywo.service;


import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;

import com.ssafy.oywo.entity.RefreshToken;

import java.util.Map;
import java.util.Optional;

public interface MemberService {
    public JwtToken signIn(String username, String password);
    public MemberDto signUp(MemberDto memberDto);
    public Optional<RefreshToken> getRefreshToken(String refreshToken);
    public Map<String,String> validateRefreshToken(String refreshToken);
}
