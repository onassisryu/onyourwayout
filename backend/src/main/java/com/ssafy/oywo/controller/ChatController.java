package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.ChatMessageDto;
import com.ssafy.oywo.dto.ChatRoomDto;
import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import com.ssafy.oywo.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations sendingOperations;

    @MessageMapping("/{roomId}")    // /send/{roomId}를 통해 여기로 전송되면 메서드 호출 -> StompConfig prefixes에서 적용한건 앞에 생략
    @SendTo("/room/{roomId}")       // 여길 구독하고 있는 곳으로 메시지 전송
    public ChatMessageDto messageHandler(@DestinationVariable Long roomId, ChatMessageDto message){
//        sendingOperations.convertAndSend("/room/"+roomId,message);
        // chatService 호출로 message를 보낸다.
        chatService.saveChatMessage(message);
        return message;
    }

    // 두 사용자의 username으로
    // 이미 등록된 채팅방이 있다면 반환
    // 없다면 새로운 채팅방을 만들어서 반환
    @PostMapping("/chat/room")
    public ChatRoomDto.Response createChatRoom(@RequestBody ChatRoomDto.Request chatRoomRequest){
        // 채팅방을 이용할 두 유저
        String memberUsername=chatRoomRequest.getMemberUsername();
        String otherUsername=chatRoomRequest.getOtherUsername();
        return chatService.createChatRoomByUsername(memberUsername,otherUsername);
    }
    
    // 사용자의 uuid로 채팅방 목록 불러오기 + 채팅방 내 구성원 정보도 함께
    @GetMapping("chat/room/{id}")
    public ResponseEntity<?> getChatRooms(@PathVariable("id") Long id){
        List<ChatRoomDto.Response> payload=chatService.getChatRoomById(id);
        return new ResponseEntity(payload, HttpStatus.OK);
    }


}
