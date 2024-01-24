package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealRequestsDto;
import com.ssafy.oywo.dto.DealResponseDto;
import com.ssafy.oywo.dto.SuccessResponseDto;
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

    @Transactional(readOnly = true)
    public List<DealResponseDto> getDeals() {
        List<Deal> deals = dealRepository.findAllByOrderByModifiedAtDesc();
        return deals
                .stream()
                .map(DealResponseDto::new)
                .toList();
    }

    public DealResponseDto createDeal(DealRequestsDto requestsDto) {
//        validateRequest(requestsDto);

        Deal deal = new Deal(requestsDto);
//        User user = userUtil.findCurrent; // user

        try {
            dealRepository.save(deal);
        } catch (Exception e) {
            throw new RuntimeException("거래 생성 중 오류 발생", e);
        }
        return new DealResponseDto(deal);
    }



//    private void validateRequest(DealRequestsDto requestsDto) {
//        if (requestsDto.getTitle() == null || requestsDto.getTitle().isEmpty()
//                || requestsDto.getReward() == null
////                || requestsDto.getRewardType() == null
//                || requestsDto.getStatus() == null)
//            throw new IllegalArgumentException("필수 입력 값 다 채우기.");
//        }

    public DealResponseDto getDeal(Long id) {
        return dealRepository.findById(id)
                .map(DealResponseDto::new)
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
                );
    }

    public DealResponseDto updateDeal(Long id, DealRequestsDto requestsDto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );

        // + 요청유저id 같지 않을 경우


        deal.update(requestsDto);
        return new DealResponseDto(deal);
    }

    public SuccessResponseDto deleteDeal(Long id, DealRequestsDto requestsDto) {
        Deal deal = dealRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("해당 거래 아이디가 존재하지 않음")
        );
        dealRepository.deleteById(id);
        return new SuccessResponseDto(true);
    }
}
