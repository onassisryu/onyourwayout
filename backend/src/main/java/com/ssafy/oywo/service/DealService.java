package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;

import java.util.List;

public interface DealService {

    List<DealDto.Response> getDeals(DealType dealType);
    DealDto.Response createDeal(DealDto.Request dto);
    DealDto.Response getDeal(Long id);
    DealDto.Response updateDeal(Long id, DealDto.Request dto);
    DealDto.Response acceptDeal(Long id, Long acceptId);
    void deleteDeal(Long id, DealDto.Request dto);

    DealDto.Response closeDeal(Long id, Long acceptId);

    MemberDto.Response reviewDeal(Long id, String gb, Long requestId);

}