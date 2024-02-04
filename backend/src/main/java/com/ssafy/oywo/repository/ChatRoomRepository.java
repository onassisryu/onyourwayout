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

    @Query(value = "select o.chat_room_id from (select c.chat_room_id from chat_user_list c where c.member_id in (select id from member where username= :othername)) o " +
            "where o.chat_room_id in (" +
            "select c.chat_room_id from member m join chat_user_list c on m.id=c.member_id where m.username= :username)",nativeQuery = true)
    Long getCommonChatRoom(@Param("username") String username, @Param("othername") String othername);

    @Query("SELECT m.chatRooms FROM Member m WHERE m.id= :id")
    Optional<List<ChatRoom>> getChatRoomById(@Param("id") Long id);

    // 채팅방에 속한 사용자 찾기
    @Query(value="select c.member_id from chat_user_list c where c.member_id!= :memberId and c.chat_room_id= :roomId",nativeQuery = true)
    Long getChatRoomMembers(@Param("roomId") Long roomId, @Param("memberId") Long memberId);
}

