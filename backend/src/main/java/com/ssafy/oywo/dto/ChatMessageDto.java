package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;


public class ChatMessageDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private Long chatRoomId;            // 채팅방 id
        private Long sendId;                // 보낸 사람 id
        private String msg;                 // 보낸 메시지
        private String img;                 // 바이트코드로 이미지를 받음
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response{
        private Long chatRoomId;            // 채팅방 id
        private Long sendId;                // 보낸 사람 id
        private String msg;                 // 보낸 메시지
        private String imgUrl;              // 이미지 주소

        public ChatMessage toEntity(ChatRoom chatRoom){
            return ChatMessage.builder()
                    .chatRoom(chatRoom)
                    .msg(msg)
                    .imgUrl(imgUrl)
                    .senderId(sendId)
                    .build();
        }
    }
}
