package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.repository.DealRepository;
import com.ssafy.oywo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class DealServiceImpl implements DealService{

    private final DealRepository dealRepository;
    private final MemberRepository memberRepository;
    private final MemberService memberService;


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
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.RECYCLE, Deal.DealStatus.CLOSE);
        } else if (dealType == DealType.PET) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.PET, Deal.DealStatus.CLOSE);
        } else if (dealType == DealType.SHOP) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.SHOP, Deal.DealStatus.CLOSE);
        } else if (dealType == DealType.ETC) {
            filteredDeals = dealRepository.findDealsByApartmentIdAndDealType(myAptId, DealType.ETC, Deal.DealStatus.CLOSE);
        } else {
            filteredDeals = dealRepository.findDealsByApartmentId(myAptId);
        }

        System.out.println("filteredDeals = " + filteredDeals);
        return filteredDeals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }


    // 사용자별 거래(요청 or 수행) 전체 조회
    @Override
    public List<DealDto.Response> getDealsByMemberId(String requestOrAccept,Long memberId) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();

        List<Deal> memberDeals;
        if (requestOrAccept.equals("request")) {
            if (!memberId.equals(loginUserId)) {
                memberDeals = dealRepository.findDealsByRequestId(memberId);
            } else {
                memberDeals = dealRepository.findDealsByRequestId(loginUserId);
            }
        } else if (requestOrAccept.equals("accept")) {
            if (!memberId.equals(loginUserId)) {
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
        if (dto.getTitle() == null || dto.getTitle().isEmpty()
                || dto.getDealType() == null) {
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

        deal.update(dto);
        dealRepository.save(deal);

        return new DealDto.Response(deal);
    }



    // 수락 and 수락 취소
    @Override
    public DealDto.Response acceptDeal(Long id, Long acceptId) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        Member acceptUser = memberRepository.findById(acceptId).orElseThrow(
                () -> new IllegalArgumentException("해당 사용자 아이디가 존재하지 않음")
        );

        // 거래 상태 확인
        // 수락
        if (deal.getDealStatus() == Deal.DealStatus.OPEN) {
            // 수락자 확인
            System.out.println("acceptUser = " + acceptUser);
            System.out.println("acceptUserId = " + acceptUser.getId());
            System.out.println("requestId = " + deal.getRequestId());

            if (deal.getRequestId().equals(acceptUser.getId())) {
                throw new IllegalStateException("요청자와 수락자는 같을 수 없음");
            }

            DealDto.Request dto = DealDto.Request.builder()
                    .acceptId(acceptId)
                    .dealStatus(Deal.DealStatus.ING)
                    .build();
            // 엔티티 갱신
            deal.update(dto);

        // 수락 취소
        } else if (deal.getDealStatus() == Deal.DealStatus.ING) {
            DealDto.Request dto = DealDto.Request.builder()
                    .acceptId(null)
                    .dealStatus(Deal.DealStatus.OPEN)
                    .build();
            // 엔티티 갱신
            deal.update(dto);

        } else {
            throw new IllegalStateException("현재 거래 상태에서는 수락할 수 없음");
        }

        // 갱신된 엔티티 저장
        dealRepository.save(deal);

        return new DealDto.Response(deal);
    }


    // 거래 완료
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

        if (deal.getAcceptId() == null) {
            throw new IllegalStateException("거래 삭제 불가능: 거래 수행자 없음");
        }

//        Member acceptUser = memberRepository.findById(deal.getAcceptId()).orElseThrow(
//                () -> new IllegalArgumentException("해당 사용자 아이디가 존재하지 않음")
//        );


        if (deal.getDealStatus() == Deal.DealStatus.ING) {
            // AcceptId member의 상태값 변경
            dealRepository.save(
                    Deal.builder()
                            .dealStatus(Deal.DealStatus.CLOSE)
                            .build());
        } else {
            throw new IllegalStateException("ING 아닌 거래는 거래완료 불가");
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
        return new DealDto.Response(deal);
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
                .score(score)
                .build()
        );

        return MemberDto.Response.of(member);
    }



    // 삭제
    @Override
    public void deleteDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        dealRepository.deleteById(id);
    }




}