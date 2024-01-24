package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealRequestsDto;
import com.ssafy.oywo.dto.DealResponseDto;
import com.ssafy.oywo.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;



    /**
     * 거래 전체 조회
     */
    @GetMapping("/api/deals")
    public List<DealResponseDto> getDeals() {
        return dealService.getDeals();
    }

    /**
     * 거래 생성
     */
    @PostMapping("/api/deal")
    public DealResponseDto createDeal(@RequestBody DealRequestsDto requestsDto) {
        return dealService.createDeal(requestsDto);
    }
}
