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
    private final ApartRepository apartRepository;
    private final HoRepository hoRepository;
    private final ChatMessageRepository chatMessageRepository;

    @Transactional
    @Override
    public ChatRoomDto.Response createChatRoomByUsername(String memberNickname, String otherNickname) {

        ChatRoomDto.Response response=null;

        Long commonRoomId= chatRoomRepository.getCommonChatRoom(memberNickname,otherNickname);

        // 상대방의 정보를 담는다.
        Member otherMember=memberRepository.findByNickname(otherNickname)
                .orElseThrow(()->new NoSuchElementException("알 수 없는 사용자입니다."));
        Long hoId=memberRepository.findHoAptIdsByMemberId(otherMember.getId());
        Ho ho=hoRepository.findById(hoId)
                .orElseThrow(()->new NoSuchElementException("채팅 상대방 : 알 수 없는 호입니다."));


        if (commonRoomId!=null){
            response=new ChatRoomDto.Response().toDto(ChatRoom.builder().id(commonRoomId).build());
        }

        // 공통된 채팅방이 없다면
        // 새로운 채팅방을 만들어 저장한다.
        else{
            ChatRoom newChatRoom=ChatRoom.builder().build();
            ChatRoom createdRoom=chatRoomRepository.save(newChatRoom);

            // 새로운 채팅방을 사용자에게 저장한다.
            Member member=memberRepository.findByNickname(memberNickname).get();
            Member other=memberRepository.findByNickname(otherNickname).get();

            List<ChatRoom> memberRoomResult=new ArrayList<>(member.getChatRooms());
            memberRoomResult.add(createdRoom);
            List<ChatRoom> otherRoomResult=new ArrayList<>(other.getChatRooms());
            otherRoomResult.add(createdRoom);

            member=member.toBuilder().chatRooms(memberRoomResult).build();
            other=other.toBuilder().chatRooms(otherRoomResult).build();

            memberRepository.save(member);
            memberRepository.save(other);

            response=new ChatRoomDto.Response().toDto(createdRoom);
        }
        response=response.toBuilder()
                .oppId(otherMember.getId())
                .oppNickName(otherMember.getNickname())
                .dong(ho.getDong())
                .hoName(ho.getName())
                .build();
        return response;
    }

    // 해당 멤버의 채팅방리스트를 구하고, 채팅방 구성원 정보를 받아서 보낸다.
    @Override
    public List<ChatRoomDto.Response> getChatRoomById(Long memberId) {
        // 사용자 uuid로 채팅방 리스트를 가져온다.
        List<ChatRoom> roomList = chatRoomRepository.getChatRoomById(memberId)
                .orElseThrow(()->new NoSuchElementException("존재하는 채팅방이 없습니다."));
        Collections.sort(roomList, new Comparator<ChatRoom>() {
            @Override
            public int compare(ChatRoom o1, ChatRoom o2) {
                return o1.getCreatedAt().compareTo(o2.getCreatedAt());
            }
        });

        List<ChatRoomDto.Response> result =new ArrayList<>();

        // 채팅방 상대 정보를 가져온다.
        for (ChatRoom chatRoom:roomList){
            Long chatRoomId= chatRoom.getId();
            Long otherMemberId=chatRoomRepository.getChatRoomMembers(chatRoomId, memberId);

            String nickname=memberRepository.findById(otherMemberId).get().getNickname();

            // 상대방 닉네임, 사는 곳 정보 불러오기
            Long hoId=memberRepository.findHoAptIdsByMemberId(otherMemberId);
            Ho ho=hoRepository.findById(hoId).orElseThrow(
                    ()->new NoSuchElementException("존재하지 않는 호입니다.")
            );


            ChatRoomDto.Response room=ChatRoomDto.Response.builder()
                    .id(chatRoomId)
                    .createdAt(chatRoom.getCreatedAt())
                    .build();

            room=room.toBuilder()
                    .oppNickName(nickname)
                    .dong(ho.getDong())
                    .hoName(ho.getName())
                    .oppId(otherMemberId)
                    .build();

            result.add(room);
        }
        return result;
    }

    @Override
    public ChatRoomDto.Response getDetailChatRoom(Long roomId, Long memberId) {
        Optional<ChatRoom> chatRoom=chatRoomRepository.findById(roomId);
        ChatRoomDto.Response response=null;
        if (chatRoom.isPresent()){
            // 채팅 상대 정보 가져오기
            Long otherMemberId=chatRoomRepository.getChatRoomMembers(roomId,memberId);
            // 상대방 닉네임, 사는 곳 정보 불러오기
            String nickname=memberRepository.findById(otherMemberId).get().getNickname();
            Long hoId=memberRepository.findHoAptIdsByMemberId(otherMemberId);
            Ho ho=hoRepository.findById(hoId).orElseThrow(
                    ()->new NoSuchElementException("존재하지 않는 호입니다.")
            );

            response=ChatRoomDto.Response.builder()
                    .id(roomId)
                    .createdAt(chatRoom.get().getCreatedAt())
                    .chatMessages(chatRoom.get().getChatMessages())
                    .oppId(otherMemberId)
                    .oppNickName(nickname)
                    .dong(ho.getDong())
                    .hoName(ho.getName())
                    .build();

        }
        return response;
    }

    // 채팅 메시지 저장
    @Override
    public void saveChatMessage(ChatMessageDto.Response message) {

        ChatRoom chatRoom=chatRoomRepository.findById(message.getChatRoomId())
                .orElseThrow(()->new NoSuchElementException("채팅방을 찾을 수 없습니다."));

        ChatMessage newMessage=message.toEntity(chatRoom);

        System.out.println(chatRoom);
        System.out.print(newMessage);
        chatMessageRepository.save(newMessage);
    }
}
