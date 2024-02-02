package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;
import org.checkerframework.checker.units.qual.A;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Table(name = "deal_image")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@SQLDelete(sql = "UPDATE deal_image SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@Builder
public class DealImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    private Deal deal;

    @Column(nullable = false, unique = true)
    private String imgUrl;

}
