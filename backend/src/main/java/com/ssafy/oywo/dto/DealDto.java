package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
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
//        private List<DealImage> dealImages;
//        private List<MultipartFile> dealImageFileList;

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

            // 이미지 저장
            Deal deal = Deal.builder()
                    .id(id)
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
//                    .dealImages()
//                    .dealImages(dealImageFileList)
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
        private List<DealImage> dealImages;
        private LocalDateTime createdAt;
        private LocalDateTime modifiedAt;
        private LocalDateTime deletedAt;

        private List<DealComplaint> complaints;
        private MemberDto.ResponseWithDeal requestInfo;

        private Long numberOfMatchingDeals = 0L;
//        private String nickname;
//        private int score;
//        private Long hoId;

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

        }

        public Response (Deal entity, List<DealComplaint> complaints, Member member) {
            this.id = entity.getId();
            this.title = entity.getTitle();
            this.content = entity.getContent();
            this.requestId = entity.getRequestId();
            this.acceptId = entity.getAcceptId();
            this.requestInfo = MemberDto.ResponseWithDeal.of(member, member.getHo());
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
            this.complaints = complaints;
        }

        public Response(Deal entity, Member member) {
            this.id = entity.getId();
            this.title = entity.getTitle();
            this.content = entity.getContent();
            this.requestId = entity.getRequestId();
            this.acceptId = entity.getAcceptId();
            this.requestInfo = MemberDto.ResponseWithDeal.of(member, member.getHo());
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

        }


        public Response(Long numberOfMatchingDeals) {
            this.numberOfMatchingDeals = numberOfMatchingDeals;
        }
    }






//    @Getter
//    public static class DealImageResponse {
//        private Long id;
//        private String imgUrl;
//
//        public DealImageResponse(DealImage dealImage) {
//            this.id = dealImage.getId();
//            this.imgUrl = dealImage.getImgUrl();
//        }
//    }
}