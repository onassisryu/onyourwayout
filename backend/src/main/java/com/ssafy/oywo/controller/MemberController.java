package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.dto.HoDto;
import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.entity.Ho;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.jwt.JwtTokenProvider;
import com.ssafy.oywo.service.DongService;
import com.ssafy.oywo.service.HoService;
import com.ssafy.oywo.service.MemberService;
import io.jsonwebtoken.Claims;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AuthorizationServiceException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;


@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/members")
public class MemberController {

    private final MemberService memberSerivce;
    private final HoService hoService;
    private final DongService dongService;
    private final JwtTokenProvider jwtTokenProvider;
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

        try{
            JwtToken jwtToken = memberSerivce.signIn(username, password);
            log.info("request username = {}, password = {}", username, password);
            log.info("jwtToken accessToken = {}, refreshToken = {}", jwtToken.getAccessToken(), jwtToken.getRefreshToken());
            
            MemberDto.Response memberResponse=memberSerivce.getMemberInfo(username,password);
            // fcm 토큰 저장
            memberSerivce.saveFcmToken(memberResponse.getId(),memberDto.getFcmToken());
            MemberDto.TotalInfo totalMemberInfo=new MemberDto.TotalInfo();


            // 사용자 id로 아파트, 동, 호를 저장한다.
            Long hoId=memberSerivce.getHoIdByMemberId(memberResponse.getId());
            Ho ho=hoService.getHoById(hoId).orElseThrow(()->new NoSuchElementException("찾을 수 없는 호입니다"));
            HoDto hoDto=HoDto.builder().name(ho.getName()).id(ho.getId()).inviteCode(ho.getInviteCode()).build();
            DongDto.Response dongResponse=dongService.getDongByHoId(hoId);

            totalMemberInfo = totalMemberInfo.toTotalInfo(memberResponse,dongResponse,hoDto);

            HashMap<String,Object> payload=new HashMap<>();
            payload.put("token",jwtToken);
            payload.put("memberInfo",totalMemberInfo);

            // 해당 아파트의 동 정보를 가져온다.
            Apartment apartment=ho.getDong().getApartment();
            //payload.put("apartment",apartment);
            List<DongDto.Response> dongList=dongService.getDongList(apartment.getId());
            payload.put("adjDongs",dongList);

            return ResponseEntity.ok(payload);

        }catch (HttpClientErrorException.Unauthorized e){
            return new ResponseEntity<>("잘못된 로그인 방식입니다.",HttpStatus.FORBIDDEN);
        }
    }

    /**
     * 회원가입
     * 인증 불필요
     * @param
     * @return
     *
     * "username", "nickname", "password", "phoneNumber", "dongId", "hoName", "inviteCode" 필수
     */
    @Operation(summary = "사용자 회원가입",description = "사용자 회원가입을 진행합니다." +
            "phoneNumber는 중복 입력을 할 수 없습니다. 초대 코드가 있다면 넣고, 없다면 빈 문자열로 요청해야 합니다.")
    @PostMapping("/signup")
    public ResponseEntity<MemberDto.Response> signUp(@RequestPart MemberDto.Request dto,
                                                     @RequestPart(required = false)MultipartFile certiImage) {
        MemberDto.Response savedMemberDto = memberSerivce.signUp(dto,certiImage);
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
    public ResponseEntity<?> validateRefreshToken(@RequestBody HashMap<String,String> bodyJson) {
        log.info("refresh controller 실행");
        // refreshToken 검증 결과를 가져옴
        Map<String, String> map = memberSerivce.validateRefreshToken(bodyJson.get("refreshToken"));
        if (map.get("status").equals("402")) {
            return new ResponseEntity<>(map, HttpStatus.PAYMENT_REQUIRED);
        }
        return new ResponseEntity<>(map, HttpStatus.OK);
    }
    /**
     *
     * @param
     * @param
     * @return
     */
    @Operation(summary = "사용자 정보 수정",description = "사용자 uuid로 사용자 정보를 수정합니다.")
    @PutMapping("/modify")
    public ResponseEntity<?> modifyUserInfo(@RequestPart MemberDto.Modification dto,
                                            @RequestPart(required = false)MultipartFile certiImage){
        MemberDto.Response modifiedMember=memberSerivce.modify(dto,certiImage);
        return new ResponseEntity<>(modifiedMember,HttpStatus.ACCEPTED);
    }

    /**
     * 회원 고유 id로 정보 확인
     * 인증 필요
     * @return
     */
    @Operation(summary = "사용자 정보 조회",description = "사용자 uuid로 사용자 정보를 조회합니다.")
    @GetMapping("/info/{id}")
    public ResponseEntity<?> getMemberInfo(@Parameter(name = "id", description = "사용자 uuid")
                                               @PathVariable("id") Long id){
        MemberDto.Response memberResponse=memberSerivce.getMemberInfo(id);

        if (memberResponse!=null){
            HashMap<String,Object> payload=new HashMap<>();
            payload.put("id",memberResponse.getId());
            payload.put("nickname",memberResponse.getNickname());
            payload.put("birthDate",memberResponse.getBirthDate());
            payload.put("phoneNumber",memberResponse.getPhoneNumber());
            payload.put("score",memberResponse.getScore());
            payload.put("certified",memberResponse.isCertified());

            return ResponseEntity.ok(payload);
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
    public ResponseEntity<?> logout(@Parameter(name = "username", description = "사용자 email")
                                        @PathVariable String username){
        // 사용자 email로 로그아웃
        memberSerivce.logout(username);
        //
        memberSerivce.removeFcmToken(username);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 사용자 id로 거주하고 있는 아파트 이름, 동, 호수 반환
    @Operation(summary="사용자 아파트, 동, 호수 조회",
            description="사용자 uuid로 거주하고 있는 아파트, 동, 호수를 조회합니다.")
    @GetMapping("/house/{id}")
    public ResponseEntity<?> getApartInfo(@Parameter(name="id", description = "사용자 uuid")
            @PathVariable("id") Long id){

        HashMap<String,Object> payload=new HashMap<>();
        HashMap<String,Object> hoPayload=new HashMap<>();
        HashMap<String,Object> dongPayload=new HashMap<>();

        // 사용자 id로 호 id를 구한다.
        Long hoId= memberSerivce.getHoIdByMemberId(id);

        // ho id로 동 id와 동 이름을 구한다.
        Ho ho=hoService.getHoById(hoId).orElseThrow(() -> new IllegalArgumentException("존재하지 않는 호입니다."));

        hoPayload.put("id",ho.getId());
        hoPayload.put("name",ho.getName());

        dongPayload.put("id",ho.getDong().getId());
        dongPayload.put("name",ho.getDong().getName());

        // 동 id로 아파트 코드와 아파트 이름을 구한다.
        Apartment apartment=ho.getDong().getApartment();

        payload.put("ho",hoPayload);
        payload.put("dong",dongPayload);
        payload.put("apartment",apartment);

        return new ResponseEntity<>(payload,HttpStatus.OK);
    }

    @GetMapping("/verify/{code}")
    public ResponseEntity<?> verifyInviteCode(@PathVariable("code") String inviteCode){
        HashMap<String,Object> payload=memberSerivce.findHoByInviteCode(inviteCode);
        if (payload==null){
            return new ResponseEntity<>("유효하지 않은 초대코드입니다.",HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(memberSerivce.findHoByInviteCode(inviteCode),HttpStatus.OK);
    }

    // 아이디 중복 여부 확인
    @GetMapping("/dup/id")
    public ResponseEntity<?> duplicateUserName(@RequestParam("value") String userName){
        boolean isExist=memberSerivce.isExistUserName(userName);
        if (isExist){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 전화번호 중복 여부 확인
    @GetMapping("/dup/phone")
    public ResponseEntity<?> duplicatePhoneNumber(@RequestParam("value") String phoneNumber){
        boolean isExist= memberSerivce.isExistPhoneNumber(phoneNumber);
        if (isExist){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    // 닉네임 중복 여부 확인
    @GetMapping("/dup/nickname")
    public ResponseEntity<?> duplicateNickName(@RequestParam("value") String nickName){
        boolean isExist= memberSerivce.isExistNickName(nickName);
        if(isExist){
            return new ResponseEntity<>(HttpStatus.CONFLICT);
        }
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/auth")
    public ResponseEntity<?> getMemberFromToken(@RequestHeader("Authorization") String accessToken){
        String token=accessToken.substring(7);
        // 사용자 아이디를 가져온다.
        String userName=jwtTokenProvider.getAuthentication(token).getName();
        return new ResponseEntity<>(memberSerivce.getMemberInfo(userName),HttpStatus.OK);
    }



}
