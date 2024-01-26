package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.repository.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DealService {

    private final DealRepository dealRepository;

    // 전체 조회
    @Transactional(readOnly = true)
    public List<DealDto.Response> getDeals() {
        List<Deal> deals = dealRepository.findAllByOrderByModifiedAtDesc();
        return deals
                .stream()
                .map(DealDto.Response::new)
                .toList();
    }

    // 생성
    public DealDto.Response createDeal(DealDto.Request dto) {
//        validateRequest(requestsDto);

        Deal deal = dto.toEntity();
//        User user = userUtil.findCurrent; // user

        try {
            dealRepository.save(deal);
        } catch (Exception e) {
            throw new RuntimeException("거래 생성 중 오류 발생", e);
        }
        return new DealDto.Response(deal);
    }



//    private void validateRequest(DealRequestsDto requestsDto) {
//        if (requestsDto.getTitle() == null || requestsDto.getTitle().isEmpty()
//                || requestsDto.getReward() == null
////                || requestsDto.getRewardType() == null
//                || requestsDto.getStatus() == null)
//            throw new IllegalArgumentException("필수 입력 값 다 채우기.");
//        }


    // 단건 조회
    @Transactional(readOnly = true)
    public DealDto.Response getDeal(Long id) {
        return dealRepository.findById(id)
                .map(DealDto.Response::new)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
    }

    // 수정
    public DealDto.Response updateDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // + 요청유저id 같지 않을 경우 exception

        deal.update(dto);

        // 거래 수락 경우(Member acceptUser)
        if (dto.isAccepted()) {
            deal.acceptDeal(acceptUser);
        }
        return new DealDto.Response(deal);
    }


    // 삭제
    public void deleteDeal(Long id, DealDto.Request dto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );
        dealRepository.deleteById(id);
    }
}