package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.service.ApartService;
import com.ssafy.oywo.service.DongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/apart")
public class ApartController {

    private final ApartService apartService;
    private final DongService dongService;

    // 법정동 코드와 아파트 이름으로 아파트 리스트 반환 메소드
    @GetMapping("/list/{areaCode}")
    public ResponseEntity<?> getApartList(@PathVariable("areaCode") String areaCode, @RequestParam String name){
        List<Apartment> apartList=new ArrayList<>();
        HashMap<String,List<Apartment>> payload=new HashMap<>();
        // 아파트 이름을 입력하지 않은 경우
        if (name.equals("")){
            apartList=apartService.getApartList(areaCode);
        }
        else{
            System.out.println(name);
            apartList=apartService.getApartList(areaCode,name);
        }
        payload.put("data",apartList);
        return ResponseEntity.ok(payload);

    }

    // 아파트 ID(식별자)로 아파트 동 리스트 반환 메소드
    @GetMapping("/dong/{aptId}")
    public ResponseEntity<?> getDongList(@PathVariable("aptId") Long aptId){
        List<DongDto.Response> dongList;
        HashMap<String,Object> payload=new HashMap<>();
        dongList=dongService.getDongList(aptId);
        payload.put("aptId",aptId);
        payload.put("data",dongList);
        return ResponseEntity.ok(payload);
    }
}
