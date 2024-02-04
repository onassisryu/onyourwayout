package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "chat_room")
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ChatRoom {

    @Id
    @Column(name = "uuid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Timestamp createdAt;

    @OneToMany(mappedBy = "chatRoom")
    private List<ChatMessage> chatMessages = new ArrayList<>();


}
