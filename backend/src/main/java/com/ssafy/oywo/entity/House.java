package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.domain.Persistable;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name="house")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class House implements Persistable<HouseId> {
    @EmbeddedId
    private HouseId id;

    @MapsId("memberId")
    @ManyToOne
    @JoinColumn(name="member_id")
    private Member member;

    @MapsId("hoId")
    @ManyToOne
    @JoinColumn(name="ho_id")
    private Ho ho;

    @CreatedDate
    private LocalDate created;

    @Override
    public HouseId getId(){
        return id;
    }
    // 새로운 엔터티 판단 전략 재정의
    @Override
    public boolean isNew(){
        return created==null;
    }

}


