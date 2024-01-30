package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.repository.ApartRepository;
import com.ssafy.oywo.repository.DongRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class DongServiceImpl implements DongService{

    private final DongRepository dongRepository;
    private final ApartRepository apartRepository;
    @Override
    public List<DongDto.Response> getDongList(Long aptId) {
        Apartment apartment = apartRepository.findById(aptId).orElseThrow();
        List<Dong> dong = dongRepository.findByApartment(apartment);

        List<DongDto.Response> responses = new ArrayList<>();
        for(Dong d : dong){
            responses.add(new DongDto.Response(d.getId(), d.getName(), d.getApartment()));
        }

        return responses;
    }
}
