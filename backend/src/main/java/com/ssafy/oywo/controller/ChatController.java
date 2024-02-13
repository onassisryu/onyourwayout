package com.ssafy.oywo.controller;

import com.google.api.Http;
import com.ssafy.oywo.dto.ChatMessageDto;
import com.ssafy.oywo.dto.ChatRoomDto;
import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import com.ssafy.oywo.service.ChatService;
import com.ssafy.oywo.service.S3UploadService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.*;
import org.apache.commons.codec.binary.Base64;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Slf4j
public class ChatController {

    private final ChatService chatService;
    private final SimpMessageSendingOperations sendingOperations;
    private final S3UploadService s3UploadService;
    @MessageMapping("/channel")    // /pub/channel를 통해 여기로 전송되면 메서드 호출 -> StompConfig prefixes에서 적용한건 앞에 생략
    //@SendTo("/room/{roomId}")       // 여길 구독하고 있는 곳으로 메시지 전송
    public ChatMessageDto.Response messageHandler(ChatMessageDto.Request message) throws IOException {
        // 바이트코드 파일로 변환
        String imgUrl="";
        if (!message.getImg().equals("")){
            imgUrl=changeBinaryImageChange(message.getImg(),message.getSendId());
        }
        // Response로 변환
        ChatMessageDto.Response response=ChatMessageDto.Response
                .builder()
                .msg(message.getMsg())
                .sendId(message.getSendId())
                .chatRoomId(message.getChatRoomId())
                .imgUrl(imgUrl).build();

        // /room/{roomId}를 구독하는 클라이언트로 메시지 객체가 전달
        sendingOperations.convertAndSend("/sub/channel/"+response.getChatRoomId(),response);
        log.info("메시지 전송 성공");

        // message를 저장한다.
        ChatMessageDto.Response result=chatService.saveChatMessage(response);
        result.setCreatedAt(LocalDateTime.now());

        return result;
    }

    // 바이트 코드를 파일 형태로 변환하여 S3에 저장하고 링크를 반환
    public String changeBinaryImageChange(String byteCode, Long senderId){
        try{
            String[] strings=byteCode.split(",");
            String base64Image=strings[1];
            String extension="";        // if 문을 통해 확장자명을 정해줌
            if(strings[0].equals("data:image/jpeg;base64")){
                extension="jpeg";
            }else if(strings[0].equals("data:image/png;base64")){
                extension="png";
            }else{
                extension="jpg";
            }

            byte[] imageBytes=Base64.decodeBase64(base64Image);

            File tempFile=File.createTempFile("image","."+extension);
            // 바이트 코드를 파일 형태로 변환
            try (OutputStream outputStream=new FileOutputStream(tempFile)){
                outputStream.write(imageBytes);
            }

            String imgUrl=s3UploadService.upload(tempFile,"ChatImage",senderId);

            try {
                FileOutputStream fileOutputStream = new FileOutputStream(tempFile); // 파일 삭제시 전부 아웃풋 닫아줘야함 (방금 생성한 임시 파일을 지워주는 과정
                fileOutputStream.close(); // 아웃풋 닫아주기
                if (tempFile.delete()) {
                    log.info("File delete success"); // tempFile.delete()를 통해 삭제
                } else {
                    log.info("File delete fail");
                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            return imgUrl;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    // 두 사용자의 username으로
    // 이미 등록된 채팅방이 있다면 반환
    // 없다면 새로운 채팅방을 만들어서 반환
    @PostMapping("/chat/room")
    public ChatRoomDto.Response createChatRoom(@RequestBody ChatRoomDto.Request chatRoomRequest){
        // 채팅방을 이용할 두 유저
        String memberNickname=chatRoomRequest.getMemberNickname();
        String otherNickname=chatRoomRequest.getOtherNickname();

        return chatService.createChatRoomByUsername(memberNickname,otherNickname);
    }
    
    // 사용자의 uuid로 채팅방 목록 불러오기 + 채팅방 내 구성원 정보도 함께
    @GetMapping("chat/room/{id}")
    public ResponseEntity<?> getChatRooms(@PathVariable("id") Long id){
        List<ChatRoomDto.Response> payload=chatService.getChatRoomById(id);
        return new ResponseEntity(payload, HttpStatus.OK);
    }

    // 채팅방 uuid로 채팅 상세 내용 불러오기
    @GetMapping("/chat/room/detail")
    public ResponseEntity<?> getDetailChatRooms(@RequestParam("room") Long id,@RequestParam("id") Long memberId){
        ChatRoomDto.Response payload=chatService.getDetailChatRoom(id,memberId);
        return new ResponseEntity<>(payload, HttpStatus.OK);
    }

    // 채팅 저장하기 - 테스트
    @PostMapping("/chat/message")
    public ResponseEntity<?> saveChatMessage(@RequestBody ChatMessageDto.Request message) throws IOException {
        // 바이트코드 파일로 변환
        String imgUrl="";
        if (!message.getImg().equals("")){
            imgUrl=changeBinaryImageChange(message.getImg(),message.getSendId());
        }
        ChatMessageDto.Response response=ChatMessageDto.Response
                .builder()
                .msg(message.getMsg())
                .sendId(message.getSendId())
                .chatRoomId(message.getChatRoomId())
                .imgUrl(imgUrl).build();

        return new ResponseEntity<>(chatService.saveChatMessage(response),HttpStatus.OK);
    }
}
