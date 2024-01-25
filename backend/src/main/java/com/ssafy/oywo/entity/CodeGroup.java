package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="code_group")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class CodeGroup {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="uuid")
    private Long uuid;

    @Column(name="group_name")
    private String groupName;
}
