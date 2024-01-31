package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.DealService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.repository.query.Param;
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


    /**
     * 거래 전체 조회 + 필터(QueryString) --> 수정 필요 (ing 중인거)
     */
    @GetMapping("/list")     // 'localhost:8080/deal/list?dealType=PET'
    public List<DealDto.Response> getDeals(
            @RequestParam(name = "dealType", defaultValue = "") DealType dealType) {

        return dealService.getDeals(dealType);
    }


    /**
     * 사용자별 거래(요청 or 수행) 전체 조회 --> 수정 필요(ing는?)
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
//        if (dto.getAcceptId() != null) {
//            return ResponseEntity.ok(dealService.acceptDeal(id, dto.getAcceptId()));
//        } else {
//            return ResponseEntity.ok(dealService.updateDeal(id, dto));
//        }
    }


    /**
     * 거래 수락 and 수락 취소 --> 수정 필요!
     */
    @PutMapping("/accept/{id}")
    public ResponseEntity<?> acceptDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {

        return ResponseEntity.ok(dealService.acceptDeal(id, dto.getAcceptId()));
    }
//    @PostMapping("/deal/accept/{id}")
//    public ResponseEntity<?> acceptDeal(@PathVariable Long id, @RequestBody Long acceptId) {
//        return ResponseEntity.ok(dealService.acceptDeal(id, acceptId));
//    }


    /**
     * 거래 완료 --> 수정필요(거래 상대방)
     */
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {
        return ResponseEntity.ok(dealService.closeDeal(id, dto.getAcceptId()) + "해당 거래가 완료되었습니다.");
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
     * 거래 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {

        dealService.deleteDeal(id, dto);
        return ResponseEntity.ok(id + "번 거래가 삭제");
    }


    /**
     * 거래 신고
     */
    @PutMapping("/complain/{id}")
    public ResponseEntity<?> complainDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {

        return ResponseEntity.ok("신고내역 테이블 필요!!!!");
    }

}