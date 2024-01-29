package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.DealService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
     * 거래 전체 조회
     */
    @GetMapping()
    public List<DealDto.Response> getDeals() {

        return dealService.getDeals();
    }

    /**
     * 거래 생성
     */
    @PostMapping
    public ResponseEntity<?> createDeal(
            @RequestBody DealDto.Request dto) {
//        String username = authentication.getName();
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
     * 거래 수락
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
     * 거래 완료
     */
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeDeal(
            @PathVariable Long id,
            @RequestBody DealDto.Request dto) throws Exception {
        return ResponseEntity.ok(dealService.closeDeal(id, dto.getAcceptId()));
    }

    /**
     * 거래 리뷰
     */
    @PutMapping("/review/{id}/{gb}")
    public ResponseEntity<?> reviewDeal(
            @PathVariable("id") Long id,
            @PathVariable("gb") String gb,
            @RequestBody DealDto.Request dto) throws Exception {

        return ResponseEntity.ok(dealService.reviewDeal(id, gb, dto));
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