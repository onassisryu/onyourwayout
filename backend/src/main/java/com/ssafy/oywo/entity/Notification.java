package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.List;

@Entity
@Table(name = "notification")
@Builder
@Getter
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE notification SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
public class Notification extends BaseTimeEntity {

    public enum NotificationType {
        CHAT, DEAL_NEW, DEAL_ACCEPT, DEAL_REJECT, DEAL_COMPLETE, DEAL_CANCEL
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

    private Long DealId;

    private Long DongId;
}
