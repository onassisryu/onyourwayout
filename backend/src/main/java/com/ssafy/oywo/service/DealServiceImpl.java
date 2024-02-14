package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.webjars.NotFoundException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DealServiceImpl implements DealService{

    private final DealRepository dealRepository;
    private final DealComplaintRepository dealComplaintRepository;
    private final DealImageRepository dealImageRepository;
    private final MemberRepository memberRepository;
    private final HoRepository hoRepository;

    private final NotificationService notificationService;
    private final S3UploadService s3UploadService;
    private final MemberService memberService;


    // 현재 로그인한 사용자 정보를 가져옴
    public Long getLoginUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Long loginUserId = memberRepository.findByUsername(username)
                .map(Member::getId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));

        log.info("loginUserName: {}, loginUserId: {}", username, loginUserId);
        return loginUserId;
        }


    // 거래 전체 조회 + 거래유형 필터(QueryString)
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDeals(DealType dealType) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        log.info("myAptId : {}", myAptId);

        // RECYCLE, PET, SHOP, ETC
        List<Deal> filteredDeals;

        if (dealType == DealType.RECYCLE) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.RECYCLE, Deal.DealStatus.OPEN, loginUserId);
        } else if (dealType == DealType.PET) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.PET, Deal.DealStatus.OPEN, loginUserId);
        } else if (dealType == DealType.SHOP) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.SHOP, Deal.DealStatus.OPEN, loginUserId);
        } else if (dealType == DealType.ETC) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.ETC, Deal.DealStatus.OPEN, loginUserId);
        } else {
            filteredDeals = dealRepository.findDealsByApartmentId(myAptId, Deal.DealStatus.OPEN, loginUserId);
        }

        System.out.println("filteredDeals = " + filteredDeals);
        return filteredDeals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }


    // 거래유형별 현재 거래에 대한 동 아이디 리스트
    @Override
    @Transactional(readOnly = true)
    public List<Long> getDongIdsByDealType(List<DealType> dealType) {

        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        log.info("myAptId : {}", myAptId);

        Set<Long> dongIdSet = new HashSet<>();
        List<Deal> dealsByDong = dealRepository.findDealsByDongIdAndDealType(
                myAptId, null, dealType, Deal.DealStatus.OPEN, loginUserId);
        for (Deal deal : dealsByDong) {
            Member requestMember = memberRepository.findById(deal.getRequestId()).orElseThrow(() -> new IllegalArgumentException("없는 requestId 사용자 입니다."));
            dongIdSet.add(requestMember.getHo().getDong().getId());
        }

        return new ArrayList<>(dongIdSet);
    }



    //동별 거래 전체 조회 + 거래 유형 필터
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDealsByDong(Long dongId, List<DealType> dealType) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        log.info("myAptId : {}", myAptId);

        List<Deal> dealsByDong = dealRepository.findDealsByDongIdAndDealType(
                myAptId, dongId, dealType, Deal.DealStatus.OPEN, loginUserId);

        log.info("dealsByDong: {}", dealsByDong);
        return dealsByDong
                .stream()
                .map(d -> new DealDto.Response(d, memberRepository.findById(d.getRequestId()).orElseThrow(() -> new IllegalArgumentException("해당 requestId의 사용자가 없음"))))
                .collect(Collectors.toList());
    }


    // 동별 거래 건 수 조회
    @Override
    @Transactional(readOnly = true)
    public Long countDealsByDong(Long dongId, List<DealType> dealType) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        log.info("myAptId : {}", myAptId);

        return dealRepository.countDealsByDongIdAndDealType(
                    myAptId, dongId, dealType, Deal.DealStatus.OPEN, loginUserId);
    }


    // 사용자별 거래(요청 or 수행) 전체 조회
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDealsByMemberId(String requestOrAccept,Long memberId) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();

        List<Deal> memberDeals;
        if (requestOrAccept.equals("request")) {
            if (memberId != null) {
                memberDeals = dealRepository.findDealsByRequestIdOrderByCreatedAtDesc(memberId);
            } else {
                memberDeals = dealRepository.findDealsByRequestIdOrderByCreatedAtDesc(loginUserId);
            }
        } else if (requestOrAccept.equals("accept")) {
            if (memberId != null) {
                memberDeals = dealRepository.findDealsByAcceptIdOrderByCreatedAtDesc(memberId);
            } else {
                memberDeals = dealRepository.findDealsByAcceptIdOrderByCreatedAtDesc(loginUserId);
            }
        } else {
            throw new IllegalArgumentException("type={request or accept}를 파라미터를 필수로 가져야함");
        }

        return memberDeals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }


    // 요청자/수행자 현재 거래 조회
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDealsBetweenUsers(Long requestId, Long acceptId) {
        List<Deal> deals = dealRepository.findByRequestIdAndAcceptIdAndDealStatus(requestId, acceptId, Deal.DealStatus.ING);
        // acceptId와 requestId로도 확인
        deals.addAll(dealRepository.findByRequestIdAndAcceptIdAndDealStatus(acceptId, requestId, Deal.DealStatus.ING));
        return deals.stream()
                    .map(d -> new DealDto.Response(d, memberRepository.findById(d.getRequestId()).orElseThrow(() -> new IllegalArgumentException("해당 requestId의 사용자가 없음"))))
                    .collect(Collectors.toList());
    }



    // 내가 나온김에 해야할 일
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getMyDealsByStatusING() {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();

        List<Deal> myIngDeals = dealRepository.findDealsByDealStatus(loginUserId, Deal.DealStatus.ING);

        return myIngDeals
                .stream()
                .map(d -> new DealDto.Response(d, memberRepository.findById(d.getRequestId()).orElseThrow(() -> new IllegalArgumentException("해당 requestId의 사용자가 없음"))))
                .collect(Collectors.toList());
    }


    // 거래 생성
    @Override
    public DealDto.Response createDeal(DealDto.Request dto, List<MultipartFile> dealImageFileList) {
        validateRequest(dto);

        // 로그인된 사용자의 id 가져오기
        Long loginUserId = memberService.getLoginUserId();

        // dealStatus -> OPEN
        dto.setDealStatus(Deal.DealStatus.OPEN);
        // requestId에 로그인사용자 id넣기
        dto.setRequestId(loginUserId);

        Deal deal = dto.toEntity();


        try {
            Deal dealSaved =  dealRepository.save(deal);

            List<String> dealImageStrList = new ArrayList<String>();
            // 이미지 업로드
            if (dealImageFileList != null) {
                for (MultipartFile dealImageFile : dealImageFileList) {
                    String dealImageStr = s3UploadService.upload(dealImageFile, "DealImage", dealSaved.getId());
                    dealImageStrList.add(dealImageStr);
                }
            }

            // 이미지String 저장
            if (dealImageStrList != null) {
                // DealImage 저장
                List<DealImage> dealImages = new ArrayList<>();
                for (String dealImageStr : dealImageStrList) {
                    DealImage dealImage = DealImage.builder()
                                                            .deal(deal)
                                                            .imgUrl(dealImageStr)
                                                            .build();
                    dealImages.add(dealImage);
                }
                dealImageRepository.saveAll(dealImages);
//                deal.setDealImages(dealImages);
            }

            // 알림 보내기
            notificationService.sendNotificationByDeal(deal);

        } catch (DataIntegrityViolationException e) {
            e.printStackTrace();
            throw new RuntimeException("거래 생성 중 데이터 무결성 위반 발생", e);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("거래 생성 중 오류 발생", e);
        }

        return new DealDto.Response(deal);
    }


    // 거래 생성 유효성 검증
    private void validateRequest(DealDto.Request dto) {
        if (dto.getTitle().isEmpty() || dto.getDealType() == null) {
            throw new IllegalArgumentException("제목/거래유형 은 필수 입력 항목임");
        }

        if (dto.getCash() < 0) {
            throw new IllegalArgumentException("현물보상금액은 음수일 수 없음");
        }

        if (dto.getCash() == 0 &&
                (dto.getItem() == null || dto.getItem().isEmpty())) {
            throw new IllegalArgumentException("현물보상 또는 물물보상은 필수 입력");
        }


        if (dto.getExpireAtStr() != null) {
            try {
                LocalDateTime expireAt = LocalDateTime.parse(dto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
                if (expireAt.isBefore(LocalDateTime.now())) {
                    throw new IllegalArgumentException("만료일은 현재 시간 이후이여야 함");
                }
            } catch (DateTimeParseException e) {
                throw new IllegalArgumentException("만료일 형식이 올바르지 않음");
            }
        }
    }


    // 거래 하나 조회
    @Override
    @Transactional(readOnly = true)
    public DealDto.Response getDeal(Long id) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();

        Deal deal = dealRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
        Member requestMember = memberRepository.findById(deal.getRequestId())
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 requestId에 대한 사용자가 없음")
                );

        return new DealDto.Response(deal, requestMember);
    }



    // 거래 수정
    @Override
    public DealDto.Response updateDeal(Long id, DealDto.Request dto, List<String> dealImageStrList) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        deal.update(dto);

        if (deal.getDealImages() != null) {
            List<DealImage> originDealImageList = dealImageRepository.findByDealIdIncludeDeleted(id); // 삭제된 이미지까지 포함
            dealImageRepository.deleteAllByDealId(id); // 이미지 삭제


            // 이미지 수정
            for (DealImage image : originDealImageList) {
                if (dealImageStrList.contains(image.getImgUrl())) {
                    image.setDeletedAt(null);
                    dealImageStrList.remove(image.getImgUrl());
                }

            }

            if (!dealImageStrList.isEmpty()) {
                // DealImage 저장
                List<DealImage> newDealImages = new ArrayList<>();
                for (String dealImageStr : dealImageStrList) {
                    DealImage dealImage = DealImage.builder()
                            .deal(deal)
                            .imgUrl(dealImageStr)
                            .build();
                    newDealImages.add(dealImage);
                }
                dealImageRepository.saveAll(newDealImages);
                deal.setDealImages(newDealImages);
            }
        }
        return new DealDto.Response(deal);
    }



    // 수락 and 수락 취소 (수행자)
    @Override
    public DealDto.Response acceptDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id (수행자)
        Long loginUserId = memberService.getLoginUserId();
        // 현재 매칭된 해줘요잉 개수
        Long numberOfMatchingDeals = dealRepository.countDealsByAcceptIdAndDealStatus(loginUserId, Deal.DealStatus.ING);

        // 거래 상태 확인
        // 수락
        if (deal.getDealStatus() == Deal.DealStatus.OPEN) {
            // 매칭된 해줘요잉이 3건이상이면 수락 안됨
            if (numberOfMatchingDeals >= 3) {
                log.info("현재 매칭 수: {}", numberOfMatchingDeals);
                return new DealDto.Response(numberOfMatchingDeals);
            }

            // 수락자 확인
            if (deal.getRequestId().equals(loginUserId)) {
                throw new IllegalStateException("요청자와 수락자는 같을 수 없음");
            }

            // 엔티티 갱신
            deal.setAcceptId(loginUserId);
            deal.setDealStatus(Deal.DealStatus.ING);

        // 수락 취소
        } else if (deal.getDealStatus() == Deal.DealStatus.ING) {
//            // 엔티티 갱신
//            deal.update(acceptDto);
            deal.setAcceptId(null);
            deal.setDealStatus(Deal.DealStatus.OPEN);


        } else {
            throw new IllegalStateException("현재 거래 상태에서는 수락할 수 없음");
        }

        // 갱신된 엔티티 저장
        notificationService.sendNotificationDealAccept(deal);
        return new DealDto.Response(deal);
        }


    // 거래 완료(요청자) - 상태 CLOSE로 변환
    @Override
    public DealDto.Response closeDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        if (deal.getAcceptId() != null || deal.getDealStatus() == Deal.DealStatus.ING) {
            deal.setDealStatus(Deal.DealStatus.CLOSE);
        } else {
            throw new IllegalStateException("거래 삭제 불가능: 진행 중인 거래가 아님");
        }

        return dealRepository.findById(id)
                .map(DealDto.Response::new)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
    }


    // 거래 리뷰
    @Override
    public MemberDto.Response reviewDeal(Long id, String gb) {
        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();

        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );
        if (deal.getDealStatus() != Deal.DealStatus.CLOSE) {
            throw new IllegalArgumentException("완료된 거래만 리뷰할 수 있습니다.");
        }
        log.info("deal Id: {}", deal.getId());

        //== 거래 상대방 가져오기 ==//
        Member member;
        // 요청자 -> 수행자 리뷰
        if (Objects.equals(deal.getRequestId(), loginUserId)) {
            // 수행자
            member = memberRepository.findById(deal.getAcceptId()).orElseThrow(
                    () -> new IllegalArgumentException("해당 acceptId 아이디가 존재하지 않음")
            );
        }
        // 수행자 -> 요청자 리뷰
        else if (Objects.equals(deal.getAcceptId(), loginUserId)) {
            // 요청자
            member = memberRepository.findById(deal.getRequestId()).orElseThrow(
                    () -> new IllegalArgumentException("해당 requestId 아이디가 존재하지 않음")
            );
        }
        else {
            throw new IllegalArgumentException("거래 당사자만 해당 거래 상대방을 리뷰할 수 있습니다.");
        }
        log.info("member Id() : {}", member.getId());

        //== 거래 상대방 이웃지수 관리 ==//
        int score = member.getScore();
        if (gb.equals("good")) {
            score++;
        } else if (gb.equals("bad")) {
            score--;
        } else {
            throw new IllegalArgumentException("good or bad 를 넣어야 합니다.");
        }

        member.setScore(score);
        Long hoId = memberRepository.findHoAptIdsByMemberId(member.getId());
        Ho ho = hoRepository.findById(hoId).orElseThrow(() -> new IllegalArgumentException("해당 호 없음"));

        return MemberDto.Response.of(member, ho);
    }



    // 삭제 (CANCEL)
    @Override
    public void deleteDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        deal.setDealStatus(Deal.DealStatus.CANCEL);
        // 상태관리
//        dealRepository.save(deal);
        // 삭제 로직
//        dealRepository.deleteById(id);
    }


    // 거래 신고
    @Override
    public void complaintDeal(Long id, DealComplaint dealComplaint) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new NotFoundException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        if (deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 신고 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 같음");
        }
        deal.setComplaint(deal.getComplaint() + 1);

        DealComplaint complaint = DealComplaint.builder()
                .deal(deal)
                .member(memberRepository.findById(loginUserId).orElseThrow(
                        () -> new NotFoundException("없는 사용자")
                ))
                .complaintType(dealComplaint.getComplaintType())
                .content(dealComplaint.getContent())
                .isRead(false)
                .build();

        dealComplaintRepository.save(complaint);
        dealRepository.save(deal);
    }


    // 나가요잉 거래 추천
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> recommendDeal(List<DealType> dealType) {
        // 로그인 사용자 id (수행자)
        Long loginUserId = memberService.getLoginUserId();
        // 현재 매칭된 해줘요잉 개수
        Long numberOfMatchingDeals = dealRepository.countDealsByAcceptIdAndDealStatus(loginUserId, Deal.DealStatus.ING);
        if (numberOfMatchingDeals >= 3) {
            throw new IllegalArgumentException("현재 매칭 중인 거래가 3개입니다.");
        }

        // 우리 동 id 구하기
        Long myDongId = dealRepository.findDongIdByMemberId(loginUserId);
        log.info("myDongId : {}", myDongId);
        // 우리 동 거래 requestId 리스트
        List<Member> requestMembers = memberRepository.findDealsByRequestIdByDongIdAndDealTypeAndDealStatus(myDongId, dealType, Deal.DealStatus.OPEN, loginUserId);
        log.info("requestMembers : {}", requestMembers.stream().map(Member::getUsername).collect(Collectors.toList()));
        // 추천 리스트
        List<Deal> recommendedDeals = new ArrayList<>();

        Map<Member, Integer> memberScore = new HashMap<>();
        Map<Member, Long> closedDealsCnt = new HashMap<>();
        Map<Member, Double> overallScores = new HashMap<>();
        for (Member requestMember : requestMembers) {
            long requestMemberId = requestMember.getId();
            // 이웃 지수
            memberScore.put(requestMember, requestMember.getScore());
            log.info("memberScore : {}", memberScore);
            // 거래 완료 수
            long dealCloseCnt = dealRepository.countDealsByRequestIdOrAcceptIdAndDealStatus(requestMemberId, requestMemberId, Deal.DealStatus.CLOSE);
            closedDealsCnt.put(requestMember, dealCloseCnt);
            log.info("closedDealsCnt : {}", closedDealsCnt);
            // 나와 거래한 빈도
            long totalDealCnt = dealRepository.countDealsByRequestIdOrAcceptId(loginUserId, loginUserId);
            long dealsWithPartnerCnt = dealRepository.countDealsByRequestIdAndAcceptId(loginUserId, requestMemberId)
                                        + dealRepository.countDealsByRequestIdAndAcceptId(requestMemberId, loginUserId);
            double dealsFrequencyWithMember = (double) dealsWithPartnerCnt/ totalDealCnt;
            if (Double.isNaN(dealsFrequencyWithMember)) {
                dealsFrequencyWithMember = 0;
            }
            log.info("dealsFrequencyWithMember : {}", dealsFrequencyWithMember);

            // 종합 평가
            double overallScore = (memberScore.get(requestMember) * 0.5)
                                    + (closedDealsCnt.get(requestMember) * 0.3)
                                    + (dealsFrequencyWithMember * 0.2);
            overallScores.put(requestMember, overallScore);
            log.info("overallScore : {}", overallScore);
        }

        // 종합 평가 기준으로 상대방 정렬
        List<Member> sortedMembers  = requestMembers.stream()
                .sorted((m1, m2) -> Double.compare(overallScores.get(m2), overallScores.get(m1)))
                .collect(Collectors.toList());

        for (Member sortedMember : sortedMembers) {
            List<Deal> dealsForMember = dealRepository.findDealsByRequestIdAndDealTypeAndDealStatus(sortedMember.getId(), dealType, Deal.DealStatus.OPEN, loginUserId);
            recommendedDeals.addAll(dealsForMember); // 종합 점수가 높은 순서대로 멤버들의 거래가 포함
        }

        return recommendedDeals.subList(0, Math.min(recommendedDeals.size(), 3)) // 거래 3개까지만
                                    .stream()
                                    .map(DealDto.Response::new)
                                    .collect(Collectors.toList());
    }

    // 나가요잉 추천 거래 신청
    @Override
    public void requestRecommendDeal(Long dealId){
        Long loginUserId = memberService.getLoginUserId();
        Member acceptMember = memberRepository.findById(loginUserId).orElseThrow(() -> new NoSuchElementException("해당하는 멤버가 없습니다."));
        Deal deal = dealRepository.findById(dealId).orElseThrow(() -> new NoSuchElementException("해당하는 거래가 없습니다."));

        if(deal.getRequestId().equals(loginUserId)){
            throw new IllegalArgumentException("자신이 요청한 거래는 요청할 수 없습니다.");
        }

        notificationService.requestRecommendDeal(deal, acceptMember);
    }

    // 나가요잉 최종확인(수락: 요청자)
    @Override
    public DealDto.Response checkOutRecommendDeal(Long id, Long acceptId) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );
        // 로그인 사용자 id(요청자)
        Long loginUserId = getLoginUserId();

        // 거래 상태 확인
        // 확인
        if (deal.getDealStatus() == Deal.DealStatus.OPEN) {
            // 확인자 확인
            if (!deal.getRequestId().equals(loginUserId)) {
                throw new IllegalStateException("요청자와 확인자는 다를 수 없음");
            }

            // 엔티티 갱신
            deal.setAcceptId(acceptId);
            deal.setDealStatus(Deal.DealStatus.ING);

        } else {
            throw new IllegalStateException("현재 거래 상태에서는 수락할 수 없음");
        }

        // 갱신된 엔티티 저장
        return new DealDto.Response(deal);
    }

    //나가요잉 신청 취소 및 거절
    @Override
    public void cancelRecommendDeal(Long dealId, Long acceptId) {
        Deal deal = dealRepository.findById(dealId).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = memberService.getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 취소 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        Member acceptMember = memberRepository.findById(acceptId).orElseThrow(
                () -> new NoSuchElementException("해당하는 멤버가 없습니다."));

        notificationService.cancelRecommendDeal(deal, acceptMember);
    }


}