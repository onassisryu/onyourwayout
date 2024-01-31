package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "noti_deal_category")
@Getter
@Builder                        // 추가
@AllArgsConstructor             // 추가
@NoArgsConstructor
public class NotiDealCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "member_id")
    private Member member;

    private DealType dealType;
}
