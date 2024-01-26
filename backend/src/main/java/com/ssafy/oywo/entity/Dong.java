package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dong")
@Getter
@NoArgsConstructor
public class Dong {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "apt_id")
    private Apartment apartment;

    private String name;

    @Builder
    public Dong(Apartment apartment, String name) {
        this.apartment = apartment;
        this.name = name;
    }
}
