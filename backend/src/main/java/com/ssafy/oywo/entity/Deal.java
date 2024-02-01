package com.ssafy.oywo.entity;

import com.ssafy.oywo.dto.DealDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "deal")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE deal SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
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

    @Column(nullable = false)
    private Long requestId;

    private Long acceptId;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String item;

    private int cash;

    @Enumerated(EnumType.STRING)
    private RewardType rewardType;

    private int complaint;

    @Enumerated(EnumType.STRING)
    private DealStatus dealStatus;

    @Enumerated(EnumType.STRING)
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