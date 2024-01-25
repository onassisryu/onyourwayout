package com.ssafy.oywo.entity;


import jakarta.persistence.*;
import lombok.Getter;

import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "member")
@Getter
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @Column(name = "email", unique = true, nullable = false)
    private String email;

    @Column(name = "nickname", unique = true)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "birth_date", nullable = false)
    private Date birthDate;

    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;

    private int score;

    private String fcmToken;

    private String profileImg;

    private int penaltyCount;

    private Timestamp pauseStartAt;

    private Timestamp pauseEndAt;

    private Time notificationStart;

    private Time notificationEnd;

    private boolean isCertified;

    private boolean isNotiDongAll;

    private boolean isNotiCategoryAll;

    private Timestamp createdAt;

    private Timestamp updatedAt;

    private Timestamp deletedAt;

    private String certificationImg;

    @OneToMany
    @JoinTable(name = "chat_user_list",
            joinColumns = @JoinColumn(name = "member_id"),
            inverseJoinColumns = @JoinColumn(name = "chat_room_id"))
    private List<ChatRoom> chatRooms = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<NotiDong> notiDongs = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<NotiDealCategory> notiDealCategories = new ArrayList<>();

    @OneToMany(mappedBy = "member")
    private List<MembersNotification> membersNotifications = new ArrayList<>();

}
