package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.service.DealService;
import com.ssafy.oywo.service.DongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/deal")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;
    private DongService dongService;


    /**
     * 거래 전체 조회 + 거래유형 필터(QueryString) - close거래 제외   --> 수정필요(동 별)
     */
    @GetMapping("/list")     // 'localhost:8080/deal/list?dealType=PET'
    public List<DealDto.Response> getDeals(
            @RequestParam(name = "dealType", defaultValue = "") DealType dealType) {

        return dealService.getDeals(dealType);
    }

    /**
     * 동별 거래 전체 조회 + 거래 유형 필터
     */
    @GetMapping("/dong/list")
    public List<DealDto.Response> getDealsByDong (
            @RequestParam(name = "dong", defaultValue = "") Long dongId,
            @RequestParam(name = "dealType", defaultValue = "") DealType dealType) {

        return dealService.getDealsByDong(dongId, dealType);
    }

    /**
     * 동별 거래 건 수 조회
     */
    @GetMapping("/dong/count")
    public ResponseEntity<?> countDealsByDong (
            @RequestParam(name = "dong", defaultValue = "") Long dongId,
            @RequestParam(name = "dealType", defaultValue = "") DealType dealType) {

        Long dealsByDongCnt = dealService.countDealsByDong(dongId, dealType);
        if (dongId != null) {
            return ResponseEntity.ok("현재 dongId =" + dongId + "에 " + dealsByDongCnt + "건의 (" + dealType +") 해줘요잉이 있습니다.");
        } else {
            return ResponseEntity.ok("현재 아파트에 " + dealsByDongCnt + "건의 (" + dealType +") 해줘요잉이 있습니다.");
        }
    }



    /**
     * 사용자별 거래(요청 or 수행) 전체 조회 --> 수정 필요(ing 표시?)
     */
    @GetMapping("/user/list")     // 'localhost:8080/deal/user/list?type=request&memberId=1'
    public List<DealDto.Response> getDealsByMemberId(
            @RequestParam(name = "type") String requestOrAccept,
            @RequestParam(name = "memberId", defaultValue = "") Long memberId) throws Exception {

        return dealService.getDealsByMemberId(requestOrAccept, memberId);
    }




    /**
     * 거래 생성
     */
    @PostMapping
    public ResponseEntity<?> createDeal(
            @RequestBody DealDto.Request dto) throws Exception {

        return ResponseEntity.ok(dealService.createDeal(dto));
    }


    /**
     * 거래 하나 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeal(@PathVariable Long id) {

        return ResponseEntity.ok(dealService.getDeal(id));
    }


    /**
     * 거래 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {

        return ResponseEntity.ok(dealService.updateDeal(id, dto));
    }


    /**
     * 거래 최종수락 and 수락 취소 (수행자)
     */
    @PutMapping("/accept/{id}")
    public ResponseEntity<?> acceptDeal(
            @PathVariable Long id) throws Exception {

//        System.out.println("acceptId = " + acceptId);

        DealDto.Response response = dealService.acceptDeal(id);
        if (response.getDealStatus() == Deal.DealStatus.ING) {
            return ResponseEntity.ok("거래가 수락되었습니다.");
        } else {
            return ResponseEntity.ok("거래수락이 취소되었습니다.");
        }
    }
//    @PostMapping("/deal/accept/{id}")
//    public ResponseEntity<?> acceptDeal(@PathVariable Long id, @RequestBody Long acceptId) {
//        return ResponseEntity.ok(dealService.acceptDeal(id, acceptId));
//    }


    /**
     * 거래 완료(요청자)
     */
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeDeal(
            @PathVariable Long id) throws Exception {


        return ResponseEntity.ok(" 해당 거래가 완료되었습니다." + dealService.closeDeal(id));
    }


    /**
     * 거래 상대방 리뷰
     */
    @PutMapping("/review/{id}/{gb}")
    public ResponseEntity<?> reviewDeal(
            @PathVariable("id") Long id,
            @PathVariable("gb") String gb) throws Exception {

        return ResponseEntity.ok(dealService.reviewDeal(id, gb));
    }





    /**
     * 거래 삭제 (CANCEL)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeal(
            @PathVariable Long id) throws Exception {

        dealService.deleteDeal(id);
        return ResponseEntity.ok(id + "번 거래가 삭제");
    }


    /**
     * 거래 신고
     */
    @PutMapping("/complain/{id}")
    public ResponseEntity<?> complainDeal(
            @PathVariable Long id,
            @RequestBody DealComplaint dealComplaint) throws Exception {

        dealService.complaintDeal(id, dealComplaint);
        return ResponseEntity.ok("해당 거래 신고됨");
    }

}