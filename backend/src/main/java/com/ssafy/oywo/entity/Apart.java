package com.ssafy.oywo.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Apart {

    @Id
    @GeneratedValue
    @Column(name = "uuid")
    private Long aptId;

    @Column(name="apt_code")
    private String aptCode;

    @Column(name="name")
    private String name;

    @Column(name="area_code")
    private String areaCode;

    @Column(name="lat")
    private double lat;

    @Column(name="long")
    private double lng;
}
