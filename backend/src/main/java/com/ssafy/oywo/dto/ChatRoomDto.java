package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


public class ChatRoomDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public class Request{
        private String memberUsername;
        private String otherUsername;
    }

    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response{
        private Long id;
        private Timestamp createdAt;
        private String name;
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
