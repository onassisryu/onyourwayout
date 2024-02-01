package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.HoDto;
import com.ssafy.oywo.entity.Ho;

import java.util.Optional;

public interface HoService {
    // ho id로 동 정보 반환
    Optional<Ho> getHoById(Long id);
}
