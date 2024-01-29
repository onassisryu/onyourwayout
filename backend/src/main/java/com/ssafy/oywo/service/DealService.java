package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;

import java.util.List;

public interface DealService {

    List<DealDto.Response> getDeals();
    DealDto.Response createDeal(DealDto.Request dto);
    DealDto.Response getDeal(Long id);
    DealDto.Response updateDeal(Long id, DealDto.Request dto);
    DealDto.Response acceptDeal(Long id, Long acceptId);
    void deleteDeal(Long id, DealDto.Request dto);

    DealDto.Response closeDeal(Long id, Long acceptId);

    DealDto.Response reviewDeal(Long id, String gb, DealDto.Request dto);

}