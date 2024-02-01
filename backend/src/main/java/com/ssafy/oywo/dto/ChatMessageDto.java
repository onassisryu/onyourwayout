package com.ssafy.oywo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

public class ChatMessageDto {
    
    // 채팅 메시지 create 요청
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        public enum MessageType{
            ENTER,TALK
        }
        private Long chatRoomId;            // 채팅방 id
        private Long sendId;                // 보낸 사람 id
        private String msg;                 // 보낸 메시지
        private String imgURL;              // 이미지 주소
        private Timestamp createdAt;        // 생성시간
    }
}
