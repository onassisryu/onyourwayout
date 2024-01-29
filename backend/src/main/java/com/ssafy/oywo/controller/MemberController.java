package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberSerivce;

    /**
     * 로그인
     * 인증 불필요
     * @param memberDto
     * @return
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody MemberDto.Request memberDto) {

        String username = memberDto.getUsername();
        String password = memberDto.getPassword();

        System.out.println("2222"+username+password);
        JwtToken jwtToken = memberSerivce.signIn(username, password);
        log.info("request username = {}, password = {}", username, password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());

        Member member=memberSerivce.getMemberInfo(username,password);

        HashMap<String,Object> payload=new HashMap<>();
        payload.put("token",jwtToken);
        payload.put("memberInfo",member);
        System.out.println(payload);
        return ResponseEntity.ok(payload);
    }

    /**
     * 회원가입
     * 인증 불필요
     * @param memberDto
     * @return
     * 
     * "username", "nickname", "password", "nickname", "phoneNumber", "dongId", "hoName", "inviteCode" 필수
     */
    @PostMapping("/signup")
    public ResponseEntity<MemberDto.Response> signUp(@RequestBody MemberDto.Request memberDto) {
        MemberDto.Response savedMemberDto = memberSerivce.signUp(memberDto);
        return ResponseEntity.ok(savedMemberDto);
    }

    /**
     * refresh token으로 access token 재발급
     * 인증 불필요
     * @param bodyJson : "refreshToken" 정보 
     * @return refreshToken이 유효한 경우 accessToken 발급
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> validateRefreshToken(@RequestBody HashMap<String,String> bodyJson){
        log.info("refresh controller 실행");
        // refreshToken 검증 결과를 가져옴
        Map<String,String> map=memberSerivce.validateRefreshToken(bodyJson.get("refreshToken"));
        if (map.get("status").equals("402")){
            return new ResponseEntity<>(map, HttpStatus.PAYMENT_REQUIRED);
        }
        return new ResponseEntity<>(map,HttpStatus.OK);
    }

    /**
     * 
     * @param id 사용자 고유 id
     * @param memberDto 사용자 관련 정보 수정
     * @return
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> modifyUserInfo(@PathVariable Long id, @RequestBody MemberDto.Request memberDto){
        Member modifiedMember=memberSerivce.modify(id, memberDto);
        return new ResponseEntity<>(modifiedMember,HttpStatus.ACCEPTED);
    }

    /**
     * 회원 고유 id로 정보 확인
     * 인증 필요
     * @return
     */
    @GetMapping("/info/{id}")
    public ResponseEntity<?> getMemberInfo(@PathVariable("id") Long id){
        Optional<Member> member=memberSerivce.getMemberInfo(id);
        if (member.isPresent()){
            return ResponseEntity.ok(member.get());
        }
        return ResponseEntity.noContent().build();
    }

    /**
     * 회원 이메일로 로그아웃
     * 인증 필요
     * @param username
     * @return
     */
    @DeleteMapping("/logout/{username}")
    public ResponseEntity<?> logout(@PathVariable String username){
        memberSerivce.logout(username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping("/test")
    public String test(){
        System.out.println("test");
        return "success";
    }
}
