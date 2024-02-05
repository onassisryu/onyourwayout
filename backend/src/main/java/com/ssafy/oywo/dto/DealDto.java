package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealComplaint;
import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.DealType;
import lombok.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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

            if (cash == 0) {
                rewardType = Deal.RewardType.ITEM;
            } else {
                rewardType = Deal.RewardType.CASH;
                item = null;
            }

//            // 이미지 저장
//            List<DealImage> dealImageList = dealImages.stream()
//                    .map(imgUrl -> DealImage.builder().imgUrl(imgUrl).build())
//                    .collect(Collectors.toList());


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
//                    .dealImages(dealImageList)
                    .build();

            return deal;
        }

//        private void addDealImagesToDeal(Deal deal) {
//            List<DealImage> dealImages = dto.getDealImages();
////            for (DealImage dealImage : dealImages) {
////                deal.addDealImage(dealImage);
//        }
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
//        private List<DealImage> dealImages;
        private List<DealImageResponse> dealImages;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private LocalDateTime deletedAt;

        private List<DealComplaint> complaints;

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

            if (entity.getDealImages() != null) {
                this.dealImages = entity.getDealImages()
                        .stream()
                        .map(DealImageResponse::new)
                        .collect(Collectors.toList());
            } else {
                this.dealImages = Collections.emptyList();
            }

            this.createdAt = entity.getCreatedAt();
            this.modifiedAt = entity.getModifiedAt();

        }

        public Response (Deal entity, List<DealComplaint> complaints) {
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
//            this.dealImages = entity.getDealImages();
            this.createdAt = entity.getCreatedAt();
            this.modifiedAt = entity.getModifiedAt();
            this.complaints = complaints;
        }
    }


    @Getter
    public static class DealImageResponse {
        private Long id;
        private String imgUrl;

        public DealImageResponse(DealImage dealImage) {
            this.id = dealImage.getId();
            this.imgUrl = dealImage.getImgUrl();
        }
    }
}