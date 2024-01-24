package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.RewardType;
import com.ssafy.oywo.entity.Status;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@NoArgsConstructor
public class DealResponseDto {

    private Long id;
    private String title;
    private String content;
    private Long reward;
    private RewardType rewardType;
    private int complaint;
    private Status status;
    private String dealType;
    private LocalDateTime expireAt;
    private List<DealImage> dealImages;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;



    public DealResponseDto(Deal entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.reward = entity.getReward();
        this.rewardType = entity.getRewardType();
        this.complaint = entity.getComplaint();
        this.status = entity.getStatus();
        this.dealType = entity.getDealType();
        this.expireAt = entity.getExpireAt();
        this.dealImages = entity.getDealImages();
        this.createdAt = entity.getCreatedAt();
        this.modifiedAt = entity.getModifiedAt();
    }
}
