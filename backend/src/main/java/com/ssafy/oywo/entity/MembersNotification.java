package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "members_notification")
@Getter
@NoArgsConstructor
public class MembersNotification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "notification_id")
    private Notification notification;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private boolean isRead;

    @Builder
    public MembersNotification(Notification notification, Member member, boolean isRead) {
        this.notification = notification;
        this.member = member;
        this.isRead = isRead;
    }
}
