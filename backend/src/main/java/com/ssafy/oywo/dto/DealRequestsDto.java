package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.DealImage;
import lombok.Getter;

import java.util.List;

@Getter
public class DealRequestsDto {

    private String title;
    private String content;
    private Long cash;
    private String item;
    private Long rewardTypeCode;
//    private int complaint;
    private Long statusCode;
    private Long dealTypeCode;
    private String expireAtStr;
    private List<DealImage> dealImages;
}
