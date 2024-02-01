package com.ssafy.oywo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class HoDto {
    private Long id;
    private String inviteCode;
    private String name;
}
