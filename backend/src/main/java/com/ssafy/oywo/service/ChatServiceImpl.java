package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.ChatMessageDto;
import com.ssafy.oywo.dto.ChatRoomDto;
import com.ssafy.oywo.entity.ChatMessage;
import com.ssafy.oywo.entity.ChatRoom;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.repository.ChatMessageRepository;
import com.ssafy.oywo.repository.ChatRoomRepository;
import com.ssafy.oywo.repository.MemberRepository;
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
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    @Override
    public ChatRoomDto.Response createChatRoomByUsername(String memberUsername, String otherUsername) {
        List<ChatRoom> memberRoomList=chatRoomRepository.getChatRoomByUsername(memberUsername)
                .orElseThrow(()->new NoSuchElementException("등록되지 않은 사용자입니다."));
        List<ChatRoom> otherRoomList=chatRoomRepository.getChatRoomByUsername(otherUsername)
                .orElseThrow(()->new NoSuchElementException("등록되지 않은 사용자입니다."));

        HashSet<ChatRoom> commonRoom=new HashSet<>();
        commonRoom.addAll(memberRoomList);
        commonRoom.addAll(otherRoomList);

        // 공통된 채팅방이 있다면
        ChatRoomDto.Response response=null;
        if (commonRoom.size()>0){
            ArrayList<ChatRoom> list=new ArrayList(commonRoom);
            response=new ChatRoomDto.Response().toDto(list.get(0));
        }

        // 공통된 채팅방이 없다면
        // 새로운 채팅방을 만들어 저장한다.
        else{
            ChatRoom newChatRoom=ChatRoom.builder().createdAt(new Timestamp(System.currentTimeMillis())).build();
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
        List<ChatRoom> roomList = chatRoomRepository.getChatRoomById(memberId).get();
        List<ChatRoomDto.Response> result =new ArrayList<>();

        for (ChatRoom chatRoom:roomList){
            Long chatRoomId= chatRoom.getId();
            List<Member> memberList=chatRoomRepository.getChatRoomMembers(chatRoomId);
            String chatRoomName="";
            // 사용자 닉네임으로 채팅방 이름 설정
            for (Member member:memberList){
                chatRoomName+=member.getNickname()+" ";
            }
            ChatRoomDto.Response room=ChatRoomDto.Response.builder()
                    .name(chatRoomName)
                    .id(chatRoomId)
                    .createdAt(chatRoom.getCreatedAt())
                    .build();

            result.add(room);
        }
        return result;
    }
    
    // 채팅 메시지 저장
    @Override
    public void saveChatMessage(ChatMessageDto message) {
        ChatRoom chatRoom=chatRoomRepository.findById(message.getChatRoomId())
                .orElseThrow(()->new NoSuchElementException("채팅방을 찾을 수 없습니다."));
        chatMessageRepository.save(message.toEntity().builder().chatRoom(chatRoom).build());
    }
}
