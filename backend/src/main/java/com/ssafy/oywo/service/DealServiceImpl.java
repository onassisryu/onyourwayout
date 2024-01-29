package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.repository.DealRepository;
import com.ssafy.oywo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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


    // 전체 거래 조회
    @Override
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDeals() {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        // 내 아파트 -> 모든 거래
        List<Deal> deals = dealRepository.findDealsByMemberId(loginUserId);

        return deals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }

    // 생성
    @Override
    public DealDto.Response createDeal(DealDto.Request dto) {
        validateRequest(dto);

        // 로그인된 사용자의 id 가져오기
        Long loginUserId = getLoginUserId();
//        Long loginUserId = memberRepository.findByUsername(username)
//                .map(Member::getId)
//                .orElseThrow(() -> new IllegalStateException("Authenticated user not found"));
        // requestId에 로그인사용자 id넣기
        dto.setRequestId(loginUserId);

        // item넣으면 -> ITEM / cash 넣으면 -> CASH
        if (dto.getItem() != null) {
            dto.setRewardType(Deal.RewardType.ITEM);
        } else if (dto.getCash() != 0) {
            dto.setRewardType(Deal.RewardType.CASH);
        }

        // dealStatus -> OPEN
        dto.setDealStatus(Deal.DealStatus.OPEN);

        Deal deal = dto.toEntity();

        try {
            dealRepository.save(deal);
        } catch (Exception e) {
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

        if (dto.getCash() != 0 && dto.getItem() != null) {
            throw new IllegalArgumentException("두 보상을 동시에 선택할 수 없음");
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


    // 단건 조회
    @Override
    @Transactional(readOnly = true)
    public DealDto.Response getDeal(Long id) {
        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        // 내 아파트 -> 모든 거래
        List<Deal> deals = dealRepository.findDealsByMemberId(loginUserId);

        return dealRepository.findById(id)
                .map(DealDto.Response::new)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
    }



    // 수정
    @Override
    public DealDto.Response updateDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // + 요청유저id 같지 않을 경우 exception

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


    // 거래 완료 + 리뷰
    @Override
    public DealDto.Response closeDeal(Long id, Long acceptId) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // 로그인 사용자 id
        Long loginUserId = getLoginUserId();
        if (!deal.getRequestId().equals(loginUserId)) {
            throw new IllegalStateException("거래 삭제 불가능: 해당 거래의 요청자와 현재 로그인 사용자가 다름");
        }

        Member acceptUser = memberRepository.findById(acceptId).orElseThrow(
                () -> new IllegalArgumentException("해당 사용자 아이디가 존재하지 않음")
        );

        if (deal.getDealStatus() == Deal.DealStatus.ING) {
            DealDto.Request dto = DealDto.Request.builder()
                    .dealStatus(Deal.DealStatus.CLOSE)
                    .build();
            // 엔티티 갱신
            deal.update(dto);
        } else {
            throw new IllegalStateException("ING 아닌 거래는 삭제 불가");
        }

        // 갱신된 엔티티 저장
        dealRepository.save(deal);

        return new DealDto.Response(deal);


    }

    // 거래 리뷰
//    @Override
//    public DealDto.Response reviewDeal(Long id, String gb, DealDto.Request dto) {
//
//        if (gb == )
//
//        return null;
//    }


    // 삭제
    @Override
    public void deleteDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        dealRepository.deleteById(id);
    }




}