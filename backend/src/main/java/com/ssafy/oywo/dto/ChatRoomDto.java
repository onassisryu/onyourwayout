package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.entity.Ho;
import lombok.*;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


public class ChatRoomDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Builder
    public static class Request{
        private String memberNickname;
        private String otherNickname;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Getter
    @Builder(toBuilder = true)
    public static class Response{
        private Long id;
        private LocalDateTime createdAt;
        private String oppNickName;             // 상대방 닉네임
        private Long oppId;                     // 상대방 uuid
        private Dong dong;                       // 상대방 동
        private String hoName;
        private List<ChatMessage> chatMessages;

        public Response toDto(ChatRoom chatRoom){
            return Response.builder()
                    .id(chatRoom.getId())
                    .createdAt(chatRoom.getCreatedAt())
                    .chatMessages(chatRoom.getChatMessages())
                    .build();
        }
    }

}
