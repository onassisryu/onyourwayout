package com.ssafy.oywo.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "chat_room")
@Builder(toBuilder = true)
@Getter
@AllArgsConstructor
@NoArgsConstructor
@SQLDelete(sql = "UPDATE chat_room SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
public class ChatRoom extends BaseTimeEntity {

    @Id
    @Column(name = "uuid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "chatRoom")
    @JsonManagedReference
    @JsonIgnore
    private List<ChatMessage> chatMessages = new ArrayList<>();
}
