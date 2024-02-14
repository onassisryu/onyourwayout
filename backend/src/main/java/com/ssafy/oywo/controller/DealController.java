package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.service.DealService;

import com.ssafy.oywo.service.S3UploadService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/deal")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;
    private final S3UploadService s3UploadService;


    /**
     * 거래 전체 조회 + 거래유형 필터(QueryString) - only ING
     * @param dealType 거래 유형
     * @return 거래 리스트
     */
    @GetMapping("/list")
    public List<DealDto.Response> getDeals(
            @RequestParam(name = "dealType", required = false) DealType dealType) {

        return dealService.getDeals(dealType);
    }


    /**
     * 거래유형별 현재 거래에 대한 동 아이디 리스트
     * @param dealType 거래 유형
     * @return 동 아이디 리스트
     */
    @GetMapping("/dong-list")
    public List<Long> getDongIdsByDealType (
            @RequestParam(name = "dealType", required = false) List<DealType> dealType) {

        return dealService.getDongIdsByDealType(dealType);
    }



    /**
     * 동별 거래 전체 조회 + 거래 유형 필터
     * @param dongId 동 아이디
     * @param dealType 거래 유형
     * @return 거래 리스트
     */
    @GetMapping("/dong/list")
    public List<DealDto.Response> getDealsByDong (
            @RequestParam(name = "dong", required = false) Long dongId,
            @RequestParam(name = "dealType", required = false) List<DealType> dealType) {

        return dealService.getDealsByDong(dongId, dealType);
    }


    /**
     * 동별 거래 건 수 조회
     * @param dongId 거래 아이디
     * @param dealType 거래 유형
     * @return 거래 건 수
     */
    @GetMapping("/dong/count")
    public ResponseEntity<?> countDealsByDong (
            @RequestParam(name = "dong", required = false) Long dongId,
            @RequestParam(name = "dealType", required = false) List<DealType> dealType) {

        Long dealsByDongCnt = dealService.countDealsByDong(dongId, dealType);

        return ResponseEntity.ok(dealsByDongCnt + "건의 " + " 해줘요잉이 있습니다.");
    }



    /**
     * 사용자별 거래(요청 or 수행) 전체 조회
     * @param requestOrAccept "request" or "accept
     * @param memberId 회원 아이디
     * @return 거래 리스트
     * @throws Exception
     */
    @GetMapping("/user/list")
    public List<DealDto.Response> getDealsByMemberId(
            @RequestParam(name = "type") String requestOrAccept,
            @RequestParam(name = "memberId", required = false) Long memberId) throws Exception {

        return dealService.getDealsByMemberId(requestOrAccept, memberId);
    }

    /**
     * 요청자/수락자 현재 거래 조회
     * @param requestId 요청자 아이디
     * @param acceptId 수락자 아이디
     * @return 거래 정보
     */
    @GetMapping("/user/{requestId}/{acceptId}")
    public ResponseEntity<?> getDealByStatusING(
            @PathVariable Long requestId, @PathVariable Long acceptId) {

        List<DealDto.ResponseWithHo> deals = dealService.getDealsBetweenUsers(requestId, acceptId);
        if (deals.isEmpty()) {
            throw new IllegalArgumentException("현재 진행 중인 거래가 없습니다.");
        }
        // 거래를 클라이언트 측에서 최신 수정일 기준으로 정렬하여 최신 거래를 찾음
        deals.sort(Comparator.comparing(DealDto.ResponseWithHo::getModifiedAt).reversed());
        DealDto.ResponseWithHo latestDeal = deals.get(0);
        return ResponseEntity.ok(latestDeal);
    }



    /**
     * 내가 나온김에 해야할 일
     * @return 거래 리스트
     */
    @GetMapping("/mying")
    public ResponseEntity<?> getMyDealsByStatusING() {
        return ResponseEntity.ok(dealService.getMyDealsByStatusING());
    }



    /**
     * 거래 생성
     * @param dto 거래 생성 정보
     * @return 거래 정보
     * @throws Exception
     */
    @PostMapping
    public ResponseEntity<?> createDeal(
            @RequestPart DealDto.Request dto,
            @RequestPart(required = false) List<MultipartFile> dealImageFileList) throws Exception {


        return ResponseEntity.ok(dealService.createDeal(dto, dealImageFileList));
    }



    /**
     * 거래 하나 조회
     * @param id 거래 아이디
     * @return 거래 정보
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getDeal(@PathVariable Long id) {

        return ResponseEntity.ok(dealService.getDeal(id));
    }



    /**
     * 거래 수정
     * @param id 거래 아이디
     * @param dto 거래 수정 정보
     * @param dealImageFileList 이미지 파일 리스트
     * @return 거래 정보
     * @throws Exception
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDeal(
            @PathVariable Long id,
            @RequestPart DealDto.Request dto,
            @RequestPart(required = false) List<MultipartFile> dealImageFileList) throws Exception {

        List<String> dealImageStrList = new ArrayList<String>();
        // 이미지 업로드
        if (dealImageFileList != null) {
            for (MultipartFile dealImageFile : dealImageFileList) {
                String dealImageStr = s3UploadService.upload(dealImageFile, "DealImage", id);
                dealImageStrList.add(dealImageStr);
            }
        }
        return ResponseEntity.ok(dealService.updateDeal(id, dto, dealImageStrList));
    }



    /**
     * 거래 최종수락 and 수락 취소 (수행자)
     * @param id 거래 아이디
     * @return 거래 수락 메시지
     * @throws Exception
     */
    @PutMapping("/accept/{id}")
    public ResponseEntity<?> acceptDeal(
            @PathVariable Long id) throws Exception {

        DealDto.Response response = dealService.acceptDeal(id);
        log.info("현재 매칭 수: {}", response.getNumberOfMatchingDeals());
        if (response.getDealStatus() == Deal.DealStatus.OPEN) {
            return ResponseEntity.ok("거래수락이 취소되었습니다.");
        } else if (response.getDealStatus() == Deal.DealStatus.ING) {
            return ResponseEntity.ok("거래가 수락되었습니다.");
        } else if (response.getNumberOfMatchingDeals() == 3) {
            return ResponseEntity.ok("더이상 수락할 수 없습니다.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("수락 실패");
        }
    }



    /**
     * 거래 완료(요청자)
     * @param id 거래 아이디
     * @return 거래 완료 메시지
     * @throws Exception
     */
    @PutMapping("/close/{id}")
    public ResponseEntity<?> closeDeal(
            @PathVariable Long id) throws Exception {

        dealService.closeDeal(id);
        return ResponseEntity.ok(" 해당 거래가 완료되었습니다.");
    }



    /**
     * 거래 상대방 리뷰
     * @param id 거래 아이디
     * @param gb "good" or "bad"
     * @return 거래 정보
     * @throws Exception
     */
    @PutMapping("/review/{id}/{gb}")
    public ResponseEntity<?> reviewDeal(
            @PathVariable("id") Long id,
            @PathVariable("gb") String gb) throws Exception {

        dealService.reviewDeal(id, gb);
        return ResponseEntity.ok("상대방에게 " + gb + "로 평가하였습니다.");
    }



    /**
     * 거래 삭제 (CANCEL)
     * @param id 거래 아이디
     * @return 거래 삭제 메시지
     * @throws Exception
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDeal(
            @PathVariable Long id) throws Exception {

        dealService.deleteDeal(id);
        return ResponseEntity.ok(id + "번 거래가 삭제되었습니다.");
    }



    /**
     * 거래 신고
     * @param id 거래 아이디
     * @param dealComplaint 신고 유형 선택
     * @return 거래 신고 메시지
     * @throws Exception
     */
    @PutMapping("/complain/{id}")
    public ResponseEntity<?> complainDeal(
            @PathVariable Long id,
            @RequestBody DealComplaint dealComplaint) throws Exception {

        dealService.complaintDeal(id, dealComplaint);
        return ResponseEntity.ok("해당 거래 신고되었습니다.");
    }


    /**
     * 나가요잉 거래 추천
     * @param dealType 거래 유형
     * @return 거래 추천 리스트 3개
     */
    @GetMapping("/out-recommend")
    public ResponseEntity<?> recommendDeal(
            @RequestParam(name = "dealType", required = false) List<DealType> dealType) {
        try {
            List<DealDto.Response> recommendedDeals = dealService.recommendDeal(dealType);
            return ResponseEntity.ok(recommendedDeals);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    /**
     * 나가요잉 추천 거래 신청
     * @param dealId 거래 아이디
     * @return 거래 요청 메시지
     */
    @GetMapping("/out-recommend/{dealId}")
    public ResponseEntity<?> requestRecommendDeal(
            @PathVariable Long dealId) {
        try {
            dealService.requestRecommendDeal(dealId);
            return ResponseEntity.ok("거래가 요청되었습니다.");
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 나가요잉 추천 거래 신청 거절 및 취소
     * @param dealId 거래 아이디
     * @param acceptId 거래 수락자 아이디(수행자)
     * @return 거래 취소 메시지
     */
    @Operation(summary = "나가요잉 추천 거래 신청 거절 및 취소",
            description = "나가요잉 추천 거래에 신청을 보냈을때 작성자가 거절하거나 시간이 지나 취소될 경우 사용하는 메서드")
    @GetMapping("/out-recommend/{dealId}/{acceptId}/cancel")
    public ResponseEntity<?> cancelRecommendDeal(
            @PathVariable Long dealId,
            @PathVariable Long acceptId) {
        try {
            dealService.cancelRecommendDeal(dealId, acceptId);
            return ResponseEntity.ok("거래 요청이 취소되었습니다.");
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * 나가요잉 최종확인(수락: 요청자)
     * @param id 거래 아이디
     * @param acceptId 거래 수락자 아이디(수행자)
     * @return 거래 수락 메시지
     * @throws Exception
     */
    @PutMapping("/out-recommend/{id}/{acceptId}")
    public ResponseEntity<?> checkOutRecommendDeal(
            @PathVariable Long id,
            @PathVariable Long acceptId) throws Exception {

        DealDto.Response response = dealService.checkOutRecommendDeal(id, acceptId);
        if (response.getDealStatus() == Deal.DealStatus.ING) {
            return ResponseEntity.ok("거래가 수락되었습니다.");
        } else {
            return ResponseEntity.ok("거래수락이 취소되었습니다.");
        }
    }


}