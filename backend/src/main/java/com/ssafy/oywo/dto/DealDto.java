package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.Members;
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
        // Members
        private Members requestId;
        private Members acceptId;
        private Long cash;
        private String item;
        private Long rewardTypeCode;
        private int complaint;
        private Long statusCode;
        private Long dealTypeCode;
        private String expireAtStr;
        private List<DealImage> dealImages;

        private boolean accepted;

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
//                    .Id(id)
                    .title(title)
                    .content(content)
                    .cash(cash)
                    .item(item)
                    .rewardTypeCode(rewardTypeCode)
                    .complaint(complaint)
                    .statusCode(statusCode)
                    .dealTypeCode(dealTypeCode)
                    .expireAt(expireAt)
                    .dealImages(dealImages)
                    .build();
            return deal;
        }

        // 거래 수락되었는지 메서드
        public boolean isAccpeted() {
            return accepted;
        }

    }



    @Getter
    public static class Response {
        private Long id;
        private String title;
        private String content;
        // Members
        private Members requestId;
        private Members acceptId;
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
}