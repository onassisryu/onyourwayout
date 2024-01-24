package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.dto.SignInDto;
import com.ssafy.oywo.dto.SignUpDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.jwttest.service.MemberService;
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
    public JwtToken signIn(@RequestBody SignInDto signInDto) {
        String username = signInDto.getUsername();
        String password = signInDto.getPassword();

        JwtToken jwtToken = memberSerivce.signIn(username, password);
        System.out.println(jwtToken);
        log.info("request username = {}, password = {}", username, password);
        log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());


        return jwtToken;
    }
    @PostMapping("/signup")
    public ResponseEntity<MemberDto> signUp(@RequestBody SignUpDto signUpDto) {
        System.out.print(signUpDto);
        MemberDto savedMemberDto = memberSerivce.signUp(signUpDto);
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
