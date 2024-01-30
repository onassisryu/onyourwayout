package com.ssafy.oywo.service;

import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.entity.Ho;
import com.ssafy.oywo.repository.ApartRepository;
import com.ssafy.oywo.repository.HoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class ApartServiceImpl implements ApartService {

    private final ApartRepository apartRepository;
    private final HoRepository hoRepository;
    @Override
    public List<Apartment> getApartList(String areaCode, String name) {
        return apartRepository.findByNameAndAreaCode(areaCode,name);
    }

    @Override
    public List<Apartment> getApartList(String areaCode) {
        return apartRepository.findByAreaCode(areaCode);
    }



}
