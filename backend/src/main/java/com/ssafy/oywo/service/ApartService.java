package com.ssafy.oywo.service;

import com.ssafy.oywo.entity.Apartment;

import java.util.List;

public interface ApartService {
    
    // 법정동 코드와 아파트 이름을 기준으로 아파트 데이터 반환
    List<Apartment> getApartList(String areaCode, String name);

    // 법정동 코드 기준으로 아파트 데이터 반환
    List<Apartment> getApartList(String areaCode);
}
