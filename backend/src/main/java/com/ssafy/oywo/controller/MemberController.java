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

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberSerivce;

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody MemberDto.Request memberDto) {

        String username = memberDto.getUsername();
        String password = memberDto.getPassword();

        JwtToken jwtToken = memberSerivce.signIn(username, password);
        log.info("request username = {}, password = {}", username, password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
        // 사용자 정보와 함께 넘겨주기

        Member member=memberSerivce.getMemberInfo(username,password);

        HashMap<String,Object> payload=new HashMap<>();
        payload.put("token",jwtToken);
        payload.put("memberInfo",member);
        return ResponseEntity.ok(payload);
    }
    @PostMapping("/signup")
    public ResponseEntity<MemberDto.Response> signUp(@RequestBody MemberDto.Request memberDto) {
        //System.out.print(memberDto);
        MemberDto.Response savedMemberDto = memberSerivce.signUp(memberDto);
        return ResponseEntity.ok(savedMemberDto);
    }
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
    @PostMapping("/test")
    public String test(){
        System.out.println("test");
        return "success";
    }

}
