package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PreRemove;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.webjars.NotFoundException;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DealServiceImpl implements DealService{

    private final DealRepository dealRepository;
    private final DealComplaintRepository dealComplaintRepository;
    private final DealImageRepository dealImageRepository;
    private final MemberRepository memberRepository;
    private final DongRepository dongRepository;


    // 현재 로그인한 사용자 정보를 가져옴
    public Long getLoginUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        Long loginUserId = memberRepository.findByUsername(username)
                .map(Member::getId)
                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
        // requestId에 로그인사용자 id넣기
        System.out.println("loginUserId = " + loginUserId);
        return loginUserId;
        }


    // 거래 전체 조회 + 거래유형 필터(QueryString)
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDeals(DealType dealType) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        System.out.println("myAptId = " + myAptId);

        // RECYCLE, PET, SHOP, ETC
        List<Deal> filteredDeals;

        if (dealType == DealType.RECYCLE) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.RECYCLE, Deal.DealStatus.OPEN);
        } else if (dealType == DealType.PET) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.PET, Deal.DealStatus.OPEN);
        } else if (dealType == DealType.SHOP) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.SHOP, Deal.DealStatus.OPEN);
        } else if (dealType == DealType.ETC) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.ETC, Deal.DealStatus.OPEN);
        } else {
            filteredDeals = dealRepository.findDealsByApartmentId(myAptId, Deal.DealStatus.OPEN);
        }

        System.out.println("filteredDeals = " + filteredDeals);
        return filteredDeals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }

    //동별 거래 전체 조회 + 거래 유형 필터
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDealsByDong(Long dongId, DealType dealType) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        // 내 아파트 동 리스트
        List<Dong> dongs = dongRepository.findByApartmentId(myAptId);

        List<Deal> dealsByDong = new ArrayList<>();

//        List<Deal> dongDeals = new ArrayList<>();
        if (dongId != null) {
            for (Dong dong : dongs) {
                log.info("myAptId:{}", myAptId);
                log.info("dongs:{}, dong.getId:{} ", dongs.stream().toList(), dong.getId());
                if (Objects.equals(dong.getId(), dongId)) {
                    log.info("Objects.equals(dong.getId(), dongId):{}", Objects.equals(dong.getId(), dongId));
                    dealsByDong = dealRepository.findDealsByDongIdAndDealType(
                            myAptId, dong.getId(), dealType, Deal.DealStatus.OPEN);

                }
            }
        } else {
            dealsByDong = dealRepository.findDealsByApartmentIdAndDealType(
                    myAptId, dealType, Deal.DealStatus.OPEN);
        }

//        dealsByDong.addAll(dongDeals);
        return dealsByDong
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }

    // 동별 거래 건 수 조회
    @Override
    @Transactional(readOnly = true)
    public Long countDealsByDong(Long dongId, DealType dealType) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        // 내 아파트 id 구하기
        Long myAptId = dealRepository.findHoAptIdsByMemberId(loginUserId);
        // 내 아파트 동 리스트
        List<Dong> dongs = dongRepository.findByApartmentId(myAptId);

        Long dealsByDongCnt = null;
        if (dongId != null) {
            for (Dong dong : dongs) {
                log.info("myAptId:{}", myAptId);
                log.info("dongs:{}, dong.getId:{} ", dongs.stream().toList(), dong.getId());
                if (Objects.equals(dong.getId(), dongId)) {
                    log.info("Objects.equals(dong.getId(), dongId):{}", Objects.equals(dong.getId(), dongId));
                    dealsByDongCnt = dealRepository.countDealsByDongIdAndDealType(
                            myAptId, dongId, dealType, Deal.DealStatus.OPEN);

                }
            }
        } else {
            dealsByDongCnt = dealRepository.countDealsByDongIdAndDealType(
                    myAptId, dongId, dealType, Deal.DealStatus.OPEN);
        }
        return dealsByDongCnt;




//        return dealRepository.countDealsByDongIdAndDealType(myAptId, dongId, dealType, Deal.DealStatus.OPEN);
    }


    // 사용자별 거래(요청 or 수행) 전체 조회
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDealsByMemberId(String requestOrAccept,Long memberId) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();

        List<Deal> memberDeals;
        if (requestOrAccept.equals("request")) {
            if (memberId != null) {
                memberDeals = dealRepository.findDealsByRequestId(memberId);
            } else {
                memberDeals = dealRepository.findDealsByRequestId(loginUserId);
            }
        } else if (requestOrAccept.equals("accept")) {
            if (memberId != null) {
                memberDeals = dealRepository.findDealsByAcceptId(memberId);
            } else {
                memberDeals = dealRepository.findDealsByAcceptId(loginUserId);
            }
        } else {
            throw new IllegalArgumentException("type={request or accept}를 파라미터를 필수로 가져야함");
        }

        return memberDeals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }


    // 거래 생성
    @Override
    public DealDto.Response createDeal(DealDto.Request dto) {
        validateRequest(dto);

        // 로그인된 사용자의 id 가져오기
        Long loginUserId = getLoginUserId();

        // dealStatus -> OPEN
        dto.setDealStatus(Deal.DealStatus.OPEN);
        // requestId에 로그인사용자 id넣기
        dto.setRequestId(loginUserId);

        Deal deal = dto.toEntity();


        try {
            dealRepository.save(deal);

            if (deal.getDealImages() != null) {
                // 이미지 저장로직
                List<DealImage> dealImages = dto.getDealImages();
                for (DealImage dealImage : dealImages) {
                    deal.addDealImage(dealImage);
                }
                dealImageRepository.saveAll(dealImages);
            }

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
        Long loginUserId = getLoginUserId();

        return dealRepository.findById(id)
                .map(DealDto.Response::new)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
    }



    // 거래 수정
    @Override
    public DealDto.Response updateDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

//        DealDto.Request updateDto = DealDto.Request.builder()
//                .id(deal.getId())
//                .title(dto.getTitle())
//                .requestId(dto.getRequestId())
//                .dealType(dto.getDealType())
//                .cash(dto.getCash())
//                .build();
//
//        Deal updateDeal = updateDto.toEntity();
//        deal = Deal.builder()
//                .title(dto.getTitle())
//                .requestId(dto.getRequestId())
//                .dealType(dto.getDealType())
//                .cash(dto.getCash())
//                .build();
////
//        System.out.println("dto.getDealType() = " + dto.getDealType());
        deal.update(dto);
//        dealRepository.save(deal);

        // 이미지 수정
        List<DealImage> dealImages = dealImageRepository.findByDealId(id);
        List<DealImage> updatedImages = new ArrayList<>();
        for (DealImage dealImage : deal.getDealImages()) {
            DealImage existingImage = findImageByUrl(dealImages, dealImage.getImgUrl());

            if (existingImage != null) {
                existingImage.setImgUrl(dealImage.getImgUrl());
                updatedImages.add(existingImage);
            } else {
                updatedImages.add(DealImage.builder()
                                .imgUrl(dealImage.getImgUrl())
                                .build());
            }
        }

//            if (dto.getDealImages() != null) {
//                List<DealImage> updatedImages = dto.getDealImages().stream()
//                        .map(imgUrl -> DealImage.builder().imgUrl(imgUrl).build())
//                        .collect(Collectors.toList());
        // 기존 이미지 제거
        dealImages.clear();
        // 이미지 추가
        dealImages.addAll(updatedImages);

        return new DealDto.Response(deal);
    }



    // 이미지 url로 찾기
    private DealImage findImageByUrl(List<DealImage> images, String imgUrl) {
        return images.stream()
                .filter(image -> imgUrl.equals(image.getImgUrl()))
                .findFirst()
                .orElse(null);
    }



    // 수락 and 수락 취소 (수행자)
    @Override
    public DealDto.Response acceptDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();

        // 거래 상태 확인
        // 수락
        if (deal.getDealStatus() == Deal.DealStatus.OPEN) {
            // 수락자 확인
//            System.out.println("acceptUser = " + acceptUser);
//            System.out.println("acceptUserId = " + acceptUser.getId());
            if (deal.getRequestId().equals(loginUserId)) {
                throw new IllegalStateException("요청자와 수락자는 같을 수 없음");
            }

//            deal = Deal.builder()
//                    .id(deal.getId())
////                    .title(deal.getTitle())
////                    .requestId(deal.getRequestId())
//                    .acceptId(acceptId)
//                    .dealStatus(Deal.DealStatus.ING)
////                    .dealType(deal.getDealType())
//                    .build();

//            deal = DealDto.Request.builder()
//                    .id(deal.getId())
//                    .acceptId(acceptId)
//                    .dealStatus(Deal.DealStatus.ING)
//                    .build().toEntity();

//            DealDto.Request acceptDto = DealDto.Request.builder()
//                    .id(deal.getId())
//                    .acceptId(dto.getAcceptId())
//                    .dealStatus(Deal.DealStatus.ING)
//                    .build();
//            // 엔티티 갱신
//            deal.update(acceptDto);
            deal.setAcceptId(loginUserId);
            deal.setDealStatus(Deal.DealStatus.ING);
//            updateDto.update()

        // 수락 취소
        } else if (deal.getDealStatus() == Deal.DealStatus.ING) {
//            deal = Deal.builder()
//                    .id(deal.getId())
//                    .title(deal.getTitle())
//                    .requestId(deal.getRequestId())
//                    .acceptId(null)
//                    .dealStatus(Deal.DealStatus.OPEN)
//                    .dealType(deal.getDealType())
//                    .build();
//            System.out.println("dea.getRequestId() = " + deal.getRequestId());;
//            DealDto.Request acceptDto = DealDto.Request.builder()
//                    .id(deal.getId())
//                    .acceptId(null)
//                    .dealStatus(Deal.DealStatus.OPEN)
//                    .build();
//            // 엔티티 갱신
//            deal.update(acceptDto);
            deal.setAcceptId(null);
            deal.setDealStatus(Deal.DealStatus.OPEN);

        } else {
            throw new IllegalStateException("현재 거래 상태에서는 수락할 수 없음");
        }

        // 갱신된 엔티티 저장
//        dealRepository.save(deal);

        return new DealDto.Response(deal);
    }


    // 거래 완료(요청자)
    @Override
    public DealDto.Response closeDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        if (deal.getAcceptId() != null || deal.getDealStatus() == Deal.DealStatus.ING) {
            deal.setDealStatus(Deal.DealStatus.CLOSE);
//            DealDto.CloseRequest closeDto = DealDto.CloseRequest.builder()
//                    .id(deal.getId())
//                    .dealStatus(Deal.DealStatus.CLOSE)
//                    .build();
//
//            deal.closeUpdate(closeDto);
//            dealRepository.save(deal);
            System.out.println(deal.getDealStatus());

            } else {
                throw new IllegalStateException("거래 삭제 불가능: 진행 중인 거래가 아님");
            }

//        if (deal.getDealStatus() == Deal.DealStatus.ING) {
//            // AcceptId member의 상태값 변경
//            DealDto.Request dto = DealDto.Request.builder()
//                    .dealStatus(Deal.DealStatus.CLOSE)
//                    .build();
//            // 엔티티 갱신
//            deal.update(dto);
//        } else {
//            throw new IllegalStateException("ING 아닌 거래는 거래완료 불가");
//        }
//
//        // 갱신된 엔티티 저장
//        dealRepository.save(deal);
//        return new DealDto.Response(deal);
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
        Long loginUserId = getLoginUserId();

        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );
        if (deal.getDealStatus() != Deal.DealStatus.CLOSE) {
            throw new IllegalArgumentException("완료된 거래만 리뷰할 수 있습니다.");
        }

        System.out.println("deal.getId() = " + deal.getId());

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
        System.out.println("member.getId() = " + member.getId());

        //== 거래 상대방 이웃지수 관리 ==//
        int score = member.getScore();

        if (gb.equals("good")) {
            // Member score +1
            score++;

        } else if (gb.equals("bad")) {
            // Member score -1
            score--;

        } else {
            throw new IllegalArgumentException("good or bad 를 넣어야 합니다.");
        }

        memberRepository.save(
                Member.builder()
                        .id(member.getId())
                        .nickname(member.getNickname())
                        .username(member.getUsername())
                        .birthDate(member.getBirthDate())
                        .phoneNumber(member.getPhoneNumber())
                        .score(score)
                        .roles(member.getRoles())
                        .password(member.getPassword())
                .build()
        );

        return MemberDto.Response.of(member);
    }



    // 삭제 (CANCEL)
    @Override
    public void deleteDeal(Long id) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        deal.setDealStatus(Deal.DealStatus.CANCEL);
        // 상태관리
        dealRepository.save(deal);
        // 삭제 로직
        dealRepository.deleteById(id);
    }


    // 거래 신고
    @Override
    public void complaintDeal(Long id, DealComplaint dealComplaint) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new NotFoundException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();

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
}