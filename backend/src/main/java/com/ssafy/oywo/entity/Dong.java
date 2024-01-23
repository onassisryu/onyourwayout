package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Dong {
    @Id
    @GeneratedValue
    @Column(name = "uuid")
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="apt_id")
    private Apart apartId;

    @Column(name="name")
    private String name;
}
