package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import com.ssafy.oywo.entity.Ho;
import com.ssafy.oywo.repository.ApartRepository;
import com.ssafy.oywo.repository.DongRepository;
import com.ssafy.oywo.repository.HoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class DongServiceImpl implements DongService{

    private final DongRepository dongRepository;
    private final ApartRepository apartRepository;
    private final HoRepository hoRepository;
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

    @Override
    public DongDto.Response getDongByHoId(Long hoId) {
        Optional<Ho> ho=hoRepository.findById(hoId);
        DongDto.Response dongResponse=null;
        if (ho.isPresent()){
            Optional<Dong> dong=dongRepository.findById(ho.get().getDong().getId());
            if (dong.isPresent()){
                dongResponse=new DongDto.Response(dong.get().getId(),dong.get().getName(),dong.get().getApartment());
            }
        }
        return dongResponse;
    }
}
