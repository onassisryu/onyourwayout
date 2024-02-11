package com.ssafy.oywo.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.ssafy.oywo.dto.DealDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.springframework.web.multipart.MultipartFile;

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
@SQLRestriction("deleted_at IS NULL AND deal_status <> 'CANCEL'")
public class Deal extends BaseTimeEntity {
    public enum RewardType {
        CASH, ITEM
    }

    public enum DealStatus {
        OPEN, ING, CLOSE, CANCEL, PAUSE
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

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private DealType dealType;

    private LocalDateTime expireAt;

    @OneToMany(mappedBy = "deal", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<DealImage> dealImages = new ArrayList<>();


    //== 연관관계 설정 메서드==//
    public void addDealImage(DealImage dealImage) {
        if (dealImages == null) {
            dealImages = new ArrayList<>();
        }
        dealImages.add(dealImage);
        dealImage.setDeal(this);
    }


    // 수정 로직
    public void update(DealDto.Request dto) {

        if (dto.getTitle() != null) this.title = dto.getTitle();
        if (dto.getContent() != null) this.content = dto.getContent();

        if (dto.getCash() != 0 && dto.getItem() != null)
            throw new IllegalArgumentException("두 보상을 동시에 선택할 수 없음");

        if (dto.getItem() != null) {
            this.cash = 0;
            this.item = dto.getItem();
            this.rewardType = RewardType.ITEM;

        } else if (dto.getCash() != 0) {
            this.cash = dto.getCash();
            this.item = null;
            this.rewardType = RewardType.CASH;
        }

        if (dto.getDealType() != null) this.dealType = dto.getDealType();
        if (dto.getExpireAtStr() != null) this.expireAt = LocalDateTime.parse(dto.getExpireAtStr(), DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
//        if (dto.getDealImageFileList() != null) this.dealImages = dto.getDealImageFileList();
    }

}