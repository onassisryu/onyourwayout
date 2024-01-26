package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;


    /**
     * 거래 전체 조회
     */
    @GetMapping("/deals")
    public List<DealDto.Response> getDeals() {
        return dealService.getDeals();
    }

    /**
     * 거래 생성
     */
    @PostMapping("/deal")
    public ResponseEntity<?> createDeal(@RequestBody DealDto.Request dto) {
        return ResponseEntity.ok(dealService.createDeal(dto));
    }


    /**
     * 거래 하나 조회
     */
    @GetMapping("/deal/{id}")
    public ResponseEntity<?> getDeal(@PathVariable Long id) {
        return ResponseEntity.ok(dealService.getDeal(id));
    }


    /**
     * 거래 수정
     */
    @PostMapping("/deal/{id}")
    public ResponseEntity<?> updateDeal(@PathVariable Long id, @RequestBody DealDto.Request dto) throws Exception {
        return ResponseEntity.ok(dealService.updateDeal(id, dto));
    }


    /**
     * 거래 삭제
     */
    @PostMapping("/deal/{id}")
    public ResponseEntity<?> deleteDeal(@PathVariable Long id, @RequestBody DealDto.Request dto) throws Exception {
        dealService.deleteDeal(id, dto);
        return ResponseEntity.ok(id);
    }


    /**
     * 거래 수락
     */
    @PostMapping("/deal/accept/{id}")
    public ResponseEntity<?> acceptDeal(@PathVariable Long id, @RequestBody Long acceptId) {
        return ResponseEntity.ok(dealService.acceptDeal(id, acceptId));
    }





}