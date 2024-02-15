package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.service.AdminService;
import com.ssafy.oywo.service.DealService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.ResponseBodyAdvice;

@Slf4j
@RestController
@RequestMapping("/admin/manages")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * 아파트 비인증 회원 조회
     * @return 회원 리스트
     */
    @GetMapping("/non-certified-member")
    public ResponseEntity<?> getNonCertifiedMembers() {

        return ResponseEntity.ok(adminService.getNonCertifiedMembers());

    }


    /**
     * 비인증 회원 상세 조회
     * @param memberId 회원 아이디
     * @return 회원 정보
     */
    @GetMapping("/non-certified-member/{memberId}")
    public ResponseEntity<?> getNonCertifiedMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(adminService.getNonCertifiedMember(memberId));
    }


    /**
     * 비인증 회원 아파트 인증
     * @param memberId 회원 아이디
     * @return 인증 확인 메시지
     */
//
    @PutMapping("/non-certified-member/{memberId}/certification")
    public ResponseEntity<?> verifyCertification(@PathVariable Long memberId) {
        boolean isVerified = adminService.verifyCertification(memberId);

        if (isVerified) {
            return ResponseEntity.ok("인증 확인 성공");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("인증 실패");
        }

    }



    /**
     * 신고된 거래 전체 조회
     * @return 거래 리스트
     */
    @GetMapping("/deal")
    public ResponseEntity<?> getDealsWithComplaint() {

        return ResponseEntity.ok(adminService.getDealsWithComplaint());
    }


    /**
     * 거래 세부 내용 조회 + 신고내역 포함
     * @param dealId 거래 아이디
     * @return 거래 정보
     */
    @GetMapping("/deal/{dealId}")
    public ResponseEntity<?> getDealWithComplaint(@PathVariable Long dealId) {

        return ResponseEntity.ok(adminService.getDealWithComplaint(dealId));
    }


    @PutMapping("/deal/re-open/{dealId}")
    public ResponseEntity<?> changeDealStatus(@PathVariable Long dealId){
        return ResponseEntity.ok(adminService.changeStatusToOpen(dealId));

    }


    /**
     * 사용자 페널티 수 추가 및 정지시간 재설정
     */
    @PutMapping("/pause")
    public ResponseEntity<?> givePenaltyAndSetPause(@RequestParam("id") Long memberId){
        return ResponseEntity.ok(adminService.updatePenaltyAndPauseTime(memberId));
    }

    /**
     * 정지된 사용자 리스트 보이기
     */
    @GetMapping("/pause")
    public ResponseEntity<?> getPausedMemberList(){
        return ResponseEntity.ok(adminService.getPausedMember());
    }




    /**
     * 정지 회원 조회
     * @return 회원 리스트
     */
    @GetMapping("/suspended-member")
    public ResponseEntity<?> manageSuspendedMembers() {
        return ResponseEntity.ok(adminService.manageSuspendedMembers());

    }


    /**
     * 회원 정지 해제
     * @param memberId 회원 아이디
     * @return 회원 정보
     */
    @PutMapping("/suspended-member/{memberId}")
    public ResponseEntity<?> unlockMember(@PathVariable Long memberId) {
        return ResponseEntity.ok(adminService.processUnlockMember(memberId));
    }

}