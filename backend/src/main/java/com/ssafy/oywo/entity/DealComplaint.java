package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "deal_complaint")
@Getter
@NoArgsConstructor
public class DealComplaint extends BaseTimeEntity{

    public enum ConmplaintType {
        CONTENT, MEMBER, ETC
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private ConmplaintType conmplaintType;

    private String content;

    private boolean isRead;
}
