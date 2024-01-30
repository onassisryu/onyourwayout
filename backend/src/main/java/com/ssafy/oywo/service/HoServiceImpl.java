package com.ssafy.oywo.service;

import com.ssafy.oywo.entity.Ho;
import com.ssafy.oywo.repository.HoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class HoServiceImpl implements HoService{

    private final HoRepository hoRepository;
    @Override
    public Optional<Ho> getHoById(Long hoId) {
        return hoRepository.findById(hoId);
    }
}
