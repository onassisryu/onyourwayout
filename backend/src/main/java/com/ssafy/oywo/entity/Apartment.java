package com.ssafy.oywo.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;

import java.math.BigDecimal;

@Entity
@Table(name = "apartment")
@Getter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE apartment SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
public class Apartment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    private String aptCode;

    private String name;

    private String areaCode;

    @Column(precision = 10, scale = 8)
    private BigDecimal lat;

    @Column(precision = 11, scale = 8)
    private BigDecimal lng;

    private String officeTelNumber;

    @Builder
    public Apartment(String aptCode, String name, String areaCode, BigDecimal lat, BigDecimal lng, String officeTelNumber) {
        this.aptCode = aptCode;
        this.name = name;
        this.areaCode = areaCode;
        this.lat = lat;
        this.lng = lng;
        this.officeTelNumber = officeTelNumber;
    }

}
