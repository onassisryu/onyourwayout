package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
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


    public ChatMessage toEntity(ChatRoom chatRoom){
        return ChatMessage.builder()
                .chatRoom(chatRoom)
                .imgUrl(imgURL)
                .msg(msg)
                .senderId(sendId)
                .build();

    }
}
