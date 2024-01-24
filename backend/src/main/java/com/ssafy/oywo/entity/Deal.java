package com.ssafy.oywo.entity;

import com.ssafy.oywo.dto.DealRequestsDto;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Getter
@Entity
@Table(name = "deal")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Deal extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    // Member
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accept_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Member AccpetId;

    @Column
    private Long cash;

    @Column
    private String item;

    @Column(name = "reward_type_code", nullable = false)
    private Long rewardTypeCode;

    @Column
    private int complaint;

    @Column(name = "status_code", nullable = false)
    @Enumerated(EnumType.STRING)
    private Long statusCode;

    @Column(name = "deal_type_code", nullable = false)
    private Long dealTypeCode;

    @Column(name = "expire_at")
    private LocalDateTime expireAt;

    @OneToMany(mappedBy = "deal", cascade = CascadeType.ALL)
    private List<DealImage> dealImages = new ArrayList<>();


    @Builder
    public Deal(DealRequestsDto requestsDto) {
        this.title = requestsDto.getTitle();
        this.content = requestsDto.getContent();
        this.cash = requestsDto.getCash();
        this.item = requestsDto.getItem();
        this.rewardTypeCode = requestsDto.getRewardTypeCode();
//        this.complaint = requestsDto.getComplaint();
        this.statusCode = requestsDto.getStatusCode();
        this.dealTypeCode = requestsDto.getDealTypeCode();
//        this.expireAt = requestsDto.getExpireAt();
        this.dealImages = requestsDto.getDealImages();

        if (requestsDto.getExpireAtStr() != null) {
            this.expireAt = LocalDateTime.parse(requestsDto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else {
            // 기본 1시간 이후로 설정
            this.expireAt = LocalDateTime.now().plusMinutes(60);
        }
    }

    public void update(DealRequestsDto requestsDto) {
        this.title = requestsDto.getTitle();
        this.content = requestsDto.getContent();
        this.cash = requestsDto.getCash();
        this.item = requestsDto.getItem();
        this.rewardTypeCode = requestsDto.getRewardTypeCode();
//        this.complaint = requestsDto.getComplaint();
        this.statusCode = requestsDto.getStatusCode();
        this.dealTypeCode = requestsDto.getDealTypeCode();
        this.expireAt = LocalDateTime.parse(requestsDto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
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
