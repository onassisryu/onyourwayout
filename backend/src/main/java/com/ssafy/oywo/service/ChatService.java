package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.ChatMessageDto;
import com.ssafy.oywo.dto.ChatRoomDto;
import com.ssafy.oywo.entity.ChatRoom;

import java.util.List;

public interface ChatService {

    public ChatRoomDto.Response createChatRoomByUsername(String memberNickname,String otherNickname);
    public List<ChatRoomDto.Response> getChatRoomById(Long memberId);
    public void saveChatMessage(ChatMessageDto message);

}
