package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.DealType;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class DealDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request {
        private Long id;
        private String title;
        private String content;
        private Long requestId;
        private Long acceptId;
        private int cash;
        private String item;
        private Deal.RewardType rewardType;
        private int complaint;
        private Deal.DealStatus dealStatus;
        private DealType dealType;
        private String expireAtStr;
        private List<DealImage> dealImages;

        public void setExpireAtStr(String expireAtStr) {
            this.expireAtStr = expireAtStr;
        }

        /*
        Dto -> Entity
         */
        public Deal toEntity() {
            LocalDateTime expireAt;
            if (expireAtStr != null) {
                expireAt = LocalDateTime.parse(expireAtStr, DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            } else {
                // 기본 1시간 이후로 설정
                expireAt = LocalDateTime.now().plusMinutes(60);
            }

            Deal deal = Deal.builder()
                    .title(title)
                    .content(content)
                    .requestId(requestId)
                    .acceptId(acceptId)
                    .cash(cash)
                    .item(item)
                    .rewardType(rewardType)
                    .complaint(complaint)
                    .dealStatus(dealStatus)
                    .dealType(dealType)
                    .expireAt(expireAt)
                    .dealImages(dealImages)
                    .build();
            return deal;
        }
    }



    @Getter
    public static class Response {
        private Long id;
        private String title;
        private String content;
        private Long requestId;
        private Long acceptId;
        private int cash;
        private String item;
        private Deal.RewardType rewardType;
        private int complaint;
        private Deal.DealStatus dealStatus;
        private DealType dealType;
        private LocalDateTime expireAt;
        private List<DealImage> dealImages;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private LocalDateTime deletedAt;

        /*
        Entity -> Dto
         */
        public Response(Deal entity) {
            this.id = entity.getId();
            this.title = entity.getTitle();
            this.content = entity.getContent();
            this.requestId = entity.getRequestId();
            this.acceptId = entity.getAcceptId();
            this.cash = entity.getCash();
            this.item = entity.getItem();
            this.rewardType = entity.getRewardType();
            this.complaint = entity.getComplaint();
            this.dealStatus = entity.getDealStatus();
            this.dealType = entity.getDealType();
            this.expireAt = entity.getExpireAt();
            this.dealImages = entity.getDealImages();
            this.createdAt = entity.getCreatedAt();
            this.modifiedAt = entity.getModifiedAt();
            this.deletedAt = entity.getDeletedAt();

        }
    }
}