package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.repository.DongRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class DongServiceImpl implements DongService{

    private final DongRepository dongRepository;
    @Override
    public List<DongDto> getDongList(int aptId) {
        return dongRepository.findByApartId(aptId);
    }
}
