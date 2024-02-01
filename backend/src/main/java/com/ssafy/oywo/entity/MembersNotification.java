package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "members_notification")
@Getter @Setter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE members_notification SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
public class MembersNotification extends BaseTimeEntity{

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

    @ColumnDefault("false")
    private boolean isRead;

    @Builder
    public MembersNotification(Notification notification, Member member, boolean isRead) {
        this.notification = notification;
        this.member = member;
        this.isRead = isRead;
    }
}
