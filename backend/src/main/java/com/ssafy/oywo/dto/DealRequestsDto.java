package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.RewardType;
import com.ssafy.oywo.entity.Status;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class DealRequestsDto {

    private String title;
    private String content;
    private Long reward;
    private RewardType rewardType;
    private Long complaint;
    private Status status;
    private String dealType;
    private LocalDateTime expireAt;
    private List<DealImage> dealImages;
}
