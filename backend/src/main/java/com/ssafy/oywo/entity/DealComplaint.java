package com.ssafy.oywo.entity;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;

@Entity
@Table(name = "deal_complaint")
@Getter @Setter
@NoArgsConstructor
@SQLDelete(sql = "UPDATE deal_complaint SET deleted_at = NOW() WHERE uuid = ?")
@SQLRestriction("deleted_at IS NULL")
@AllArgsConstructor
@Builder
public class DealComplaint extends BaseTimeEntity{

    public enum ComplaintType {
        Sexual, LegalIssue, Violent, Harmful, Spam, ETC
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "uuid")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "deal_id")
    @JsonIgnore
    private Deal deal;

    @ManyToOne
    @JoinColumn(name = "member_id")
    @JsonIgnore
    private Member member;

    @Enumerated(EnumType.STRING)
    private ComplaintType complaintType;

    private String content;

    @ColumnDefault("false")
    private boolean isRead;
}