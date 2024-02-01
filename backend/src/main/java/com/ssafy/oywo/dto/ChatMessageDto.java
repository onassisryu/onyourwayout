package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.ChatMessage;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private Long chatRoomId;            // 채팅방 id
    private Long sendId;                // 보낸 사람 id
    private String msg;                 // 보낸 메시지
    private String imgURL;              // 이미지 주소
    private Timestamp createdAt;        // 생성시간

    public ChatMessage toEntity(){
        return ChatMessage.builder()
                .imgUrl(imgURL)
                .senderId(sendId)
                .createdAt(createdAt)
                .build();

    }
}
