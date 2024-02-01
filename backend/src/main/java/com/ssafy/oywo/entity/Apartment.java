package com.ssafy.oywo.entity;


import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "apartment")
@Getter
@NoArgsConstructor
public class Apartment extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    private String aptCode;

    private String name;

    private String areaCode;

    private BigDecimal lat;

    private BigDecimal lng;

    @Builder
    public Apartment(String aptCode, String name, String areaCode, BigDecimal lat, BigDecimal lng) {
        this.aptCode = aptCode;
        this.name = name;
        this.areaCode = areaCode;
        this.lat = lat;
        this.lng = lng;
    }

}
