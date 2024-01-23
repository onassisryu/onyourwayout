package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealRequestsDto;
import com.ssafy.oywo.dto.DealResponseDto;
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
        validateRequest(requestsDto);

        Deal deal = new Deal(requestsDto);

        try {
            dealRepository.save(deal);
        } catch (Exception e) {
            throw new RuntimeException("거래 생성 중 오류 발생", e);
        }
        return new DealResponseDto(deal);
    }

    private void validateRequest(DealRequestsDto requestsDto) {
        if (requestsDto.getTitle() == null || requestsDto.getTitle().isEmpty()
                || requestsDto.getReward() == null
                || requestsDto.getRewardType() == null
                || requestsDto.getStatus() == null
                || requestsDto.getDealType() == null || requestsDto.getDealType().isEmpty()){
            throw new IllegalArgumentException("필수 입력 값을 채워주세요.");
        }
    }
}
