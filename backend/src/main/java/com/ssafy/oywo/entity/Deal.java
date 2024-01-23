package com.ssafy.oywo.entity;

import com.ssafy.oywo.dto.DealRequestsDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Deal extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column
    private Long reward;

    @Column(name = "reward_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private RewardType rewardType;

    @Column
    private Long complaint;

    @Column
    @Enumerated(EnumType.STRING)
    private Status status;

    @Column(name = "deal_type")
    @Enumerated(EnumType.STRING)
    private String dealType;

    @Column(name = "expire_at")
    private LocalDateTime expireAt;

    @OneToMany(mappedBy = "deal", cascade = CascadeType.ALL)
    private List<DealImage> dealImages = new ArrayList<>();

    public Deal(DealRequestsDto requestsDto) {
        this.title = requestsDto.getTitle();
        this.content = requestsDto.getContent();
        this.reward = requestsDto.getReward();
        this.rewardType = requestsDto.getRewardType();
        this.complaint = requestsDto.getComplaint();
        this.status = requestsDto.getStatus();
        this.dealType = requestsDto.getDealType();
        this.expireAt = requestsDto.getExpireAt();
        this.dealImages = requestsDto.getDealImages();
    }

//    public void setExpireAt(LocalDateTime expireAt) {
//        this.expireAt = expireAt;
//        expireAt.getDeal().add(this);
//    }

    public void addDealImage(DealImage dealImage) {
        dealImages.add(dealImage);
        dealImage.setDeal(this);
    }

}
