package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@Entity
public class DealImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    private Deal dealId;

    @Column(nullable = false)
    private String imgUrl;


    // 거래 정보 저장
    public void setDeal(Deal deal) {
        this.dealId= deal;

        if (!deal.getDealImages().contains(this)) {
            deal.getDealImages().add(this);
        }
    }

}
