package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.ChatRoom;
import com.ssafy.oywo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;


public interface ChatRoomRepository extends JpaRepository<ChatRoom,Long> {

    @Query("SELECT m.chatRooms FROM Member m WHERE m.username= :username")
    Optional<List<ChatRoom>> getChatRoomByUsername(
            @Param("username") String username);
    @Query("SELECT m.chatRooms FROM Member m WHERE m.id= :id")
    Optional<List<ChatRoom>> getChatRoomById(@Param("id") Long id);

    // 채팅방에 속한 사용자 찾기
    @Query(value="select * from member where member.id in (" +
            "select clist.member_id from chat_user_list clist where chat_room_id= :roomId)",nativeQuery = true)
    List<Member> getChatRoomMembers(@Param("roomId") Long roomId);
}

