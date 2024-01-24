package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.RefreshToken;
import com.ssafy.oywo.jwt.JwtTokenProvider;
import com.ssafy.oywo.repository.HoRepository;
import com.ssafy.oywo.repository.HouseRepository;
import com.ssafy.oywo.repository.MemberRepository;
import com.ssafy.oywo.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final HoRepository hoRepository;
    private final HouseRepository houseRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public JwtToken signIn(String username, String password) {

        // 1. username + password 를 기반으로 Authentication 객체 생성
        // 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);

        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        // authenticate 메서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);

        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        // 기존에 존재하는 refreshToken 삭제
        if (refreshTokenRepository.existsByUserName(username)) {
            log.info("기존에 존재하는 refreshToken 삭제");
            refreshTokenRepository.deleteByUserName(username);
        }
        RefreshToken refreshToken=RefreshToken.builder().userName(username).refreshToken(jwtToken.getRefreshToken()).build();
        refreshTokenRepository.save(refreshToken);

        return jwtToken;
    }

    @Transactional
    @Override
    public MemberDto signUp(MemberDto memberDto) {
        if (memberRepository.existsByUsername(memberDto.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 사용자 이름입니다.");
        }
        // Password 암호화
        String encodedPassword = passwordEncoder.encode(memberDto.getPassword());
        List<String> roles = new ArrayList<>();
        roles.add("USER");  // USER 권한 부여
    /*
        // 초대 코드 확인
        // 1. 초대코드가 존재하는 경우
        String inviteCode=signUpDto.getInviteCode();
        Optional<Ho> ho=hoRepository.findByInviteCode(inviteCode);
        // 거주자 리스트에 추가
        if(ho.isPresent()){
            // 호 아이디를 받는다.
            Long hoId=ho.get().getId();

            // 거주자에 등록한다.

        }
        // 2. 초대코드가 올바르지 않거나 존재하지 않는 경우
        else{
            Optional<Ho> existedHo=hoRepository.findByDongIdAndName(signUpDto.getDongId(), signUpDto.getHo());
            //  2-1. 등록되어 있지 않은 호인 경우

            //  2-2. 이미 등록되어 있는 호인 경우
        }

*/
        Member member=memberRepository.save(memberDto.toEntity());

        return MemberDto.toDto(member);
    }

    public Optional<RefreshToken> getRefreshToken(String refreshToken){
        return refreshTokenRepository.findByRefreshToken(refreshToken);
    }
    public Map<String,String> validateRefreshToken(String refreshToken){
        // 결과를 담을 hashmap
        Map<String,String> map=new HashMap<>();
        String createdAccessToken= jwtTokenProvider.validateRefreshToken(refreshToken);

        // refreshToken이 만료되었을 경우
        if (createdAccessToken==null){
            map.put("status","402");
            map.put("message","Refresh 토큰이 만료되었습니다. 로그인이 필요합니다.");

        }
        // refreshToken이 만료 전인 경우
        else{
            map.put("status","200");
            map.put("message","Refresh 토큰을 통한 Access Token 생성이 완료되었습니다.");
            map.put("accessToken",createdAccessToken);
        }
        return map;

    }
}
