package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ho")
@Getter
@NoArgsConstructor
public class Ho {

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

    @Builder
    public Ho(Dong dong, String name, String inviteCode) {
        this.dong = dong;
        this.name = name;
        this.inviteCode = inviteCode;
    }

}
