package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;

import java.util.List;

public interface DealService {

    // 거래 전체 조회 + 거래유형 필터(QueryString)
    List<DealDto.Response> getDeals(DealType dealType);
    // 사용자별 거래(요청 or 수행) 전체 조회
    List<DealDto.Response> getDealsByMemberId(String requestOrAccept,Long memberId);
    // 거래 생성
    DealDto.Response createDeal(DealDto.Request dto);
    // 거래 하나 조회
    DealDto.Response getDeal(Long id);
    // 거래 수정
    DealDto.Response updateDeal(Long id, DealDto.Request dto);
    // 거래 수락 and 수락 취소
    DealDto.Response acceptDeal(Long id, Long acceptId);
    // 거래 완료
    DealDto.Response closeDeal(Long id);
    // 거래 리뷰
    MemberDto.Response reviewDeal(Long id, String gb);
    // 거래 삭제
    void deleteDeal(Long id, DealDto.Request dto);

    // 거래 신고
}