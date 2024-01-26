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

    public void update(DealDto.Request dto) {
        this.id = dto.getId();
        this.requestId = dto.getRequestId();
        this.acceptId = dto.getAcceptId();
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.item = dto.getItem();
        this.cash = dto.getCash();
        this.rewardType = dto.getRewardType();
        this.complaint = dto.getComplaint();

        // dealStatus 갱신
        if (dto.getDealStatus() != null) {
            this.dealStatus = dto.getDealStatus();
        }

        this.dealStatus = dto.getDealStatus();
        this.dealType = dto.getDealType();
        if (dto.getExpireAtStr() != null) {
            this.expireAt = LocalDateTime.parse(dto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        } else {
            // 기본 1시간 이후로 설정
            this.expireAt = LocalDateTime.now().plusMinutes(60);
        }
//        this.expireAt = dto.getExpireAtStr();
        this.dealImages = dto.getDealImages();

    }
}
