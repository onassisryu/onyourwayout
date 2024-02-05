package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.ChatMessageDto;
import com.ssafy.oywo.dto.ChatRoomDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ChatServiceImpl implements ChatService{
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;
    private final HoRepository hoRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    @Override
    public ChatRoomDto.Response createChatRoomByUsername(String memberUsername, String otherUsername) {

        ChatRoomDto.Response response=null;

        Long commonRoomId= chatRoomRepository.getCommonChatRoom(memberUsername,otherUsername);


        if (commonRoomId!=null){
            response=new ChatRoomDto.Response().toDto(ChatRoom.builder().id(commonRoomId).build());
        }

        // 공통된 채팅방이 없다면
        // 새로운 채팅방을 만들어 저장한다.
        else{
            ChatRoom newChatRoom=ChatRoom.builder().build();
            ChatRoom createdRoom=chatRoomRepository.save(newChatRoom);

            // 새로운 채팅방을 사용자에게 저장한다.
            Member member=memberRepository.findByUsername(memberUsername).get();
            Member other=memberRepository.findByUsername(otherUsername).get();

            List<ChatRoom> memberRoomResult=new ArrayList<>(member.getChatRooms());
            memberRoomResult.add(createdRoom);
            List<ChatRoom> otherRoomResult=new ArrayList<>(other.getChatRooms());
            otherRoomResult.add(createdRoom);

            member=member.toBuilder().chatRooms(memberRoomResult).build();
            other=other.toBuilder().chatRooms(otherRoomResult).build();

            System.out.println(member);
            System.out.println(other);
            memberRepository.save(member);
            memberRepository.save(other);

            response=new ChatRoomDto.Response().toDto(createdRoom);
        }

        return response;
    }

    // 해당 멤버의 채팅방리스트를 구하고, 채팅방 구성원 정보를 받아서 보낸다.
    @Override
    public List<ChatRoomDto.Response> getChatRoomById(Long memberId) {
        // 사용자 uuid로 채팅방 리스트를 가져온다.
        List<ChatRoom> roomList = chatRoomRepository.getChatRoomById(memberId)
                .orElseThrow(()->new NoSuchElementException("존재하는 채팅방이 없습니다."));
        List<ChatRoomDto.Response> result =new ArrayList<>();

        // 채팅방 상대 정보를 가져온다.
        for (ChatRoom chatRoom:roomList){
            Long chatRoomId= chatRoom.getId();
            Long otherMemberId=chatRoomRepository.getChatRoomMembers(chatRoomId, memberId);

            // otherMemberId 어떻게 받아와지는지 확인하기
            System.out.println("=====otherMemberId========="+otherMemberId);
            String nickname=memberRepository.findById(memberId).get().getNickname();

            // 상대방 닉네임, 사는 곳 정보 불러오기
            Long hoId=memberRepository.findHoAptIdsByMemberId(otherMemberId);
            Ho ho=hoRepository.findById(hoId).orElseThrow(
                    ()->new NoSuchElementException("존재하지 않는 호입니다.")
            );


            ChatRoomDto.Response room=ChatRoomDto.Response.builder()
                    .id(chatRoomId)
                    .createdAt(chatRoom.getCreatedAt())
                    .build();

            room=room.toBuilder().oppNickName(nickname).dong(ho.getDong()).hoName(ho.getName()).build();
            result.add(room);
        }
        return result;
    }
    
    // 채팅 메시지 저장
    @Override
    public void saveChatMessage(ChatMessageDto message) {
        ChatRoom chatRoom=chatRoomRepository.findById(message.getChatRoomId())
                .orElseThrow(()->new NoSuchElementException("채팅방을 찾을 수 없습니다."));
        chatMessageRepository.save(message.toEntity().toBuilder().chatRoom(chatRoom).build());
    }
}
