package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "notification")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    public enum NotificationType {
        CHAT, NOTI_DONG, NOTI_BLOCK, NOTI_APT
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    private String title;

    private String message;

    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;

    @OneToMany(mappedBy = "notification")
    private List<MembersNotification> membersNotifications;

}
