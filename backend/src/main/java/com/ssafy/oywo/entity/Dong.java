package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="dong")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Dong {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name="apt_id")
    private Apart apart;

    @Column(name="name")
    private String name;
}
