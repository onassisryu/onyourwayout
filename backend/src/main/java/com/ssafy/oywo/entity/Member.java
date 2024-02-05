package com.ssafy.oywo.entity;


import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
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
@Builder(toBuilder = true)
@Getter
@Setter
@ToString
@NoArgsConstructor
@AllArgsConstructor
@SQLDelete(sql = "UPDATE member SET deleted_at = NOW() WHERE uuid = ?")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
@SQLRestriction("deleted_at IS NULL")
public class Member extends BaseTimeEntity implements UserDetails {

    @Getter
    public enum RoleType{
        ROLE_USER("USER"), ROLE_ADMIN("ADMIN");

        private final String role;

        RoleType(String role){
            this.role=role;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @Column(name = "email", unique = true, nullable = false)
    private String username;

    @Column(name = "nickname", unique = true)
    private String nickname;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "birth_date", nullable = false)
    private Date birthDate;

    @Column(name = "phone_number", unique = true, nullable = false)
    private String phoneNumber;

    @ColumnDefault("50")
    private int score;

    private String fcmToken;

    private String profileImg;

    @ColumnDefault("0")
    private int penaltyCount;

    private Timestamp pauseStartAt;

    private Timestamp pauseEndAt;

    private Time notificationStart;

    private Time notificationEnd;

    private boolean isCertified;

    private boolean isNotiDongAll;

    private boolean isNotiCategoryAll;

    private String certificationImg;

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