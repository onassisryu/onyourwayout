package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.MemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
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

    @Operation(summary = "사용자 로그인",description = "사용자 이메일(username)과 비밀번호(password)로 로그인을 수행합니다.")
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
     * "username", "nickname", "password", "phoneNumber", "dongId", "hoName", "inviteCode" 필수
     */
    @Operation(summary = "사용자 회원가입",description = "사용자 회원가입을 진행합니다." +
            "phoneNumber는 중복 입력을 할 수 없습니다. 초대 코드가 있다면 넣고, 없다면 빈 문자열로 요청해야 합니다.")
    @PostMapping("/signup")
    public ResponseEntity<MemberDto.Response> signUp(@RequestBody MemberDto.Request memberDto) {
        System.out.println(memberDto);
        MemberDto.Response savedMemberDto = memberSerivce.signUp(memberDto);
        return ResponseEntity.ok(savedMemberDto);
    }

    /**
     * refresh token으로 access token 재발급
     * 인증 불필요
     * @param bodyJson : "refreshToken" 정보 
     * @return refreshToken이 유효한 경우 accessToken 발급
     */

    @Operation(summary = "access token 재발행",description = "refresh token 정보로 access token을 발급받습니다. " +
            "'refreshToken'을 key로 갖고 refresh token String 값을 value로 json에 담아 요청합니다.")
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
    @Operation(summary = "사용자 정보 수정",description = "사용자 uuid로 사용자 정보를 수정합니다.")
    @PutMapping("/{id}")
    public ResponseEntity<?> modifyUserInfo(@Parameter(name = "id", description = "사용자 uuid") @PathVariable Long id, @RequestBody MemberDto.Request memberDto){
        Member modifiedMember = memberSerivce.modify(id, memberDto);
        return new ResponseEntity<>(modifiedMember,HttpStatus.ACCEPTED);
    }

    /**
     * 회원 고유 id로 정보 확인
     * 인증 필요
     * @return
     */
    @Operation(summary = "사용자 정보 조회",description = "사용자 uuid로 사용자 정보를 조회합니다.")
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
    @Operation(summary = "사용자 로그아웃",description = "사용자 email로 로그아웃합니다.")
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
