package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="apartment")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Apart {

    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long aptId;

    @Column(name="apt_code")
    private String aptCode;

    @Column(name="name")
    private String name;

    @Column(name="area_code")
    private String areaCode;

    @Column(name="lat",precision = 11)
    private double lat;

    @Column(name="long",precision = 11)
    private double lng;
}
