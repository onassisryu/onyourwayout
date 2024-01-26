package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deal")
@Getter
@NoArgsConstructor
public class Deal extends BaseTimeEntity {
    public enum RewardType {
        CASH, ITEM
    }

    public enum DealStatus {
        OPEN, ING, CLOSE
    }

    @Id
    @Column(name = "uuid")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long requestId;

    private Long acceptId;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String item;

    private int cash;

    private RewardType rewardType;

    private int complaint;

    private DealStatus dealStatus;

    private DealType dealType;

    private Timestamp expireAt;

    @OneToMany(mappedBy = "dealId")
    private List<DealImage> dealImages = new ArrayList<>();
}
