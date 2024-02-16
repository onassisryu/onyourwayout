package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealComplaint;
import com.ssafy.oywo.entity.DealType;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DealService {

    // 거래 전체 조회 + 거래유형 필터(QueryString)
    List<DealDto.Response> getDeals(DealType dealType);
    // 거래유형별 현재 거래에 대한 동 아이디 리스트
    List<Long> getDongIdsByDealType(List<DealType> dealType);
    // 동 별 거래 전체 조회 + 거래 유형 필터
    List<DealDto.Response> getDealsByDong(Long dongId, List<DealType> dealType);
    // 동 별 거래 건수 조회
    Long countDealsByDong(Long dongId, List<DealType> dealType);
    // 사용자별 거래(요청 or 수행) 전체 조회
    List<DealDto.Response> getDealsByMemberId(String requestOrAccept,Long memberId);
    // 요청자/수행자 최신거래(ING, CLOSE) 조회
    List<DealDto.ResponseWithHo> getDealsBetweenUsers(Long requestId, Long acceptId);
    // 내가 나온김에 해야할 일
    List<DealDto.ResponseWithHo> getMyDealsByStatusING();
    // 거래 생성
    DealDto.Response createDeal(DealDto.Request dto, List<MultipartFile> dealImageFileList);
    // 거래 하나 조회
    DealDto.Response getDeal(Long id);
    // 거래 수정
    DealDto.Response updateDeal(Long id, DealDto.Request dto, List<String> dealImageStrList);
    // 거래 수락 and 수락 취소
    DealDto.Response acceptDeal(Long id);
    // 거래 완료
    DealDto.Response closeDeal(Long id);
    // 거래 리뷰
    MemberDto.Response reviewDeal(Long id, String gb);
    // 거래 삭제
    void deleteDeal(Long id);
    // 거래 신고
    void complaintDeal(Long id, DealComplaint dealComplaint);


    // 나가요잉 거래 추천
    List<DealDto.Response> recommendDeal(List<DealType> dealType);

    void requestRecommendDeal(Long dealId);
    // 나가요잉 최종확인(수락: 요청자)
    DealDto.Response checkOutRecommendDeal(Long id, Long acceptId);

    void cancelRecommendDeal(Long dealId, Long acceptId);

}