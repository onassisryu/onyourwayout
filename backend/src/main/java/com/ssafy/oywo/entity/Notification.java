package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "notification")
@Getter
@NoArgsConstructor
public class Notification {

    enum NotificationType {
        CHAT, NOTI_DONG, NOTI_BLOCK, NOTI_APT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    private String title;

    private String message;

    private NotificationType notificationType;

    @OneToMany(mappedBy = "notification")
    private List<MembersNotification> membersNotifications;

}
