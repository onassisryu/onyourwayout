package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealImage;
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
    private Long cash;
    private String item;
    private Long rewardTypeCode;
    private int complaint;
    private Long statusCode;
    private Long dealTypeCode;
    private LocalDateTime expireAt;
    private List<DealImage> dealImages;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;
    private LocalDateTime deletedAt;


    public DealResponseDto(Deal entity) {
        this.id = entity.getId();
        this.title = entity.getTitle();
        this.content = entity.getContent();
        this.cash = entity.getCash();
        this.item = entity.getItem();
        this.rewardTypeCode = entity.getRewardTypeCode();
        this.complaint = entity.getComplaint();
        this.statusCode = entity.getStatusCode();
        this.dealTypeCode = entity.getDealTypeCode();
        this.expireAt = entity.getExpireAt();
        this.dealImages = entity.getDealImages();
        this.createdAt = entity.getCreatedAt();
        this.modifiedAt = entity.getModifiedAt();
        this.deletedAt = entity.getDeletedAt();
    }
}
