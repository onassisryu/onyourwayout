package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Dong;

import java.util.List;

public interface DongService {
    // 아파트 코드로 동 리스트를 반환
    List<DongDto> getDongList(int aptId);
}
