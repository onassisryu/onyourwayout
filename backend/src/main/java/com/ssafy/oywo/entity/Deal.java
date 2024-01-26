package com.ssafy.oywo.entity;

import com.ssafy.oywo.dto.DealDto;
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

    // Members
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "request_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Members requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "accept_id", nullable = false, foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
    private Members acceptId;

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
    public Deal(Long id, String title, String content, Members requestId, Members acceptId, Long cash, String item, Long rewardTypeCode, int complaint, Long statusCode, Long dealTypeCode, LocalDateTime expireAt, List<DealImage> dealImages, boolean acceptDeal) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.requestId = requestId;
        this.acceptId = acceptId;
        this.cash = cash;
        this.item = item;
        this.rewardTypeCode = rewardTypeCode;
        this.complaint = complaint;
        this.statusCode = statusCode;
        this.dealTypeCode = dealTypeCode;
        this.expireAt = expireAt;
        this.dealImages = dealImages;

    }


    // 거래 정보 수정
    public void update(DealDto.Request dto) {
        this.title = dto.getTitle();
        this.content = dto.getContent();
        //Members
        this.requestId = dto.getRequestId();
        this.acceptId = dto.getAcceptId();
        this.cash = dto.getCash();
        this.item = dto.getItem();
        this.rewardTypeCode = dto.getRewardTypeCode();
        this.complaint = dto.getComplaint();
        this.statusCode = dto.getStatusCode();
        this.dealTypeCode = dto.getDealTypeCode();
        if (dto.getExpireAtStr() != null) {
            this.expireAt = LocalDateTime.parse(dto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else {
            this.expireAt = LocalDateTime.now().plusMinutes(60);
        }
        this.dealImages = dto.getDealImages();
    }

    //== 비즈니스 로직 ==//
    /**
     * 거래 수락
     */
    public void acceptDeal(Members acceptUser) {
        // 수락 유저 설정
        this.acceptId = acceptUser;

        // 상태 코드 변경
        this.statusCode = 1L;

        // 알림
    }



    public void addDealImage(DealImage dealImage) {
        dealImages.add(dealImage);
        dealImage.setDeal(this);
    }

}