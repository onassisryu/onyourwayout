package com.ssafy.oywo.service;


import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;

import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.RefreshToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

public interface MemberService {
    public JwtToken signIn(String username, String password);
    public MemberDto.Response signUp(MemberDto.Request memberDto, MultipartFile certiImage);
    public Optional<RefreshToken> getRefreshToken(String refreshToken);
    public Map<String,String> validateRefreshToken(String refreshToken);

    public MemberDto.Response modify(Member member);
    public MemberDto.Response modify(Long id, MemberDto.Request memberDto);

    public MemberDto.Response modifyWithAlarm(Member member);

    public void logout(String username);

    public MemberDto.Response getMemberInfo(String username, String password);
    public MemberDto.Response getMemberInfo(Long id);

    public Long getHoIdByMemberId(Long memberId);

    // member id로 Fcm token을 저장
    public void saveFcmToken(Long memberId, String FcmToken);
    
    // member id list로 Fcm token 리스트 반환
    public List<String> getFcmTokens(List<Long> memberIdList);

    public void removeFcmToken(String username);

    public HashMap<String,Object> findHoByInviteCode(String inviteCode);

    public Long getLoginUserId();

    public boolean isExistUserName(String userName);

    public boolean isExistNickName(String nickName);

    public boolean isExistPhoneNumber(String phoneNumber);
}
