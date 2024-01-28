package com.ssafy.oywo.entity;

import com.ssafy.oywo.dto.DealDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deal")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    private LocalDateTime expireAt;

    @OneToMany(mappedBy = "dealId")
    private List<DealImage> dealImages = new ArrayList<>();


    // 수정 로직
    public void update(DealDto.Request dto) {
        if (dto.getAcceptId() != null) {
            this.acceptId = dto.getAcceptId();
        }

        if (dto.getTitle() != null) {
            this.title = dto.getTitle();
        }

        if (dto.getContent() != null) {
            this.content = dto.getContent();
        }

        if (dto.getItem() != null) {
            this.item = dto.getItem();
        }

        if (dto.getCash() > 0) {
            this.cash = dto.getCash();
        }

        if (dto.getRewardType() != null) {
            this.rewardType = dto.getRewardType();
        }

        if (dto.getComplaint() > 0) {
            this.complaint = dto.getComplaint();
        }

        // dealStatus 갱신
        if (dto.getDealStatus() != null) {
            this.dealStatus = dto.getDealStatus();
        }

        if (dto.getDealType() != null) {
            this.dealType = dto.getDealType();
        }

        if (dto.getExpireAtStr() != null) {
            this.expireAt = LocalDateTime.parse(dto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        }

        if (dto.getDealImages() != null) {
            this.dealImages = dto.getDealImages();
        }

    }
}