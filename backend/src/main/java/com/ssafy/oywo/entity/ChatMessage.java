package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@Entity
@Table(name = "chat_message")
@Getter
@Builder(toBuilder = true)
@AllArgsConstructor
@NoArgsConstructor
public class ChatMessage {


    @Id
    @Column(name = "uuid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chat_room_id")
    private ChatRoom chatRoom;

    @Column(name = "sender_id")
    private Long senderId;

    private String msg;

    @Column(name="img_url")
    private String imgUrl;

    @Column(name="created_at")
    private Timestamp createdAt;

}
