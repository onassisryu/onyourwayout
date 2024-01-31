package com.ssafy.oywo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.ssafy.oywo.entity.DealType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.sql.Time;
import java.util.List;

public class AlarmDto {


    /**
     * 알림(동, 카테고리 유형) 설정할 때 DTO
     */
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Builder
    public static class Setting{
        private Long memberId;              // 사용자 id

        private boolean isNotiDongAll;        // 모든 동 알림 여부
        private boolean isNotiCategoryAll;    // 모든 카테고리 알림 여부
        
        private List<DealType> dealTypeList;    // 설정할 거래 유형 코드
        private List<Long> dongIdList;          // 설정할 동 리스트

        @JsonFormat(pattern = "HH:mm:ss")
        private Time notificationStart;         // 알람 받을 시작 시간

        @JsonFormat(pattern = "HH:mm:ss")
        private Time notificationEnd;           // 알람 받을 마지막 시간

    }
}
