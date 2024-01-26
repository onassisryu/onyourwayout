package com.ssafy.oywo.service;

import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.repository.ApartRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class ApartServiceImpl implements ApartService {

    private final ApartRepository apartRepository;
    @Override
    public List<Apartment> getApartList(String areaCode, String name) {
        return apartRepository.findByNameAndAreaCode(areaCode,name);
    }

    @Override
    public List<Apartment> getApartList(String areaCode) {
        return apartRepository.findByAreaCode(areaCode);
    }

}
