package com.ssafy.oywo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="code")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Code {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    @Column(name="code_id")
    private Long codeId;

    @ManyToOne
    @JoinColumn(name="code_group_id")
    private CodeGroup codeGroup;

    @Column(name="code_name")
    private String codeName;

    public Code(Long codeId){
        this.codeId=codeId;
    }

}
