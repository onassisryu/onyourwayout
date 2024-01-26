package com.ssafy.oywo.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.Time;
import java.sql.Timestamp;
import java.sql.Date;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "member")
@Getter
public class Member implements UserDetails {

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


    // 이전 코드
    @ElementCollection(fetch = FetchType.EAGER)
    @Builder.Default
    private List<String> roles = new ArrayList<>();

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // 이전 코드
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }



    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
