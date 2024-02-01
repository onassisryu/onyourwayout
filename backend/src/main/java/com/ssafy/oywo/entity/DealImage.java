package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Table(name = "deal_image")
@Getter
@NoArgsConstructor
@Entity
@SQLDelete(sql = "UPDATE deal_image SET deleted_at = NOW() WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
public class DealImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    private Deal dealId;

    @Column(nullable = false)
    private String imgUrl;


}
