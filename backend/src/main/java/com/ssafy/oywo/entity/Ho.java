package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ho")
@Getter
@Builder                    // 추가
@AllArgsConstructor         // 추가
@NoArgsConstructor
@SQLDelete(sql = "UPDATE ho SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
public class Ho extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "dong_id")
    private Dong dong;

    private String name;

    private String inviteCode;
    
    @OneToMany
    @JoinTable(name = "house",
            joinColumns = @JoinColumn(name = "ho_id"),
            inverseJoinColumns = @JoinColumn(name = "member_id"))
    private List<Member> member = new ArrayList<>();

}
