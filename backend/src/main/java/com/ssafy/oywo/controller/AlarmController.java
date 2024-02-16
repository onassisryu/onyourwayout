package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.AlarmSettingDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.NotiDealCategory;
import com.ssafy.oywo.entity.NotiDong;
import com.ssafy.oywo.service.MemberService;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/alarm")
public class AlarmController {

    private final MemberService memberSerivce;

    // 사용자 uuid로 설정한 알림 확인
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getAlarm(@PathVariable Long id){

        MemberDto.Response member=memberSerivce.getMemberInfo(id);

        // 존재하지 않는 사용자인 경우
        if(member==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HashMap<String,Object> payload=new HashMap<>();
        List<NotiDong> notiDongList=new ArrayList<>();
        List<NotiDealCategory> notiDealCategoryList=new ArrayList<>();

        for (NotiDong notiDong: member.getNotiDongs()){
            NotiDong dong=new NotiDong();
            notiDongList.add(dong.builder()
                            .dongId(notiDong.getDongId())
                    .build());
        }

        for (NotiDealCategory notiDealCategory:member.getNotiDealCategories()){
            NotiDealCategory category=new NotiDealCategory();
            notiDealCategoryList.add(
                    category.builder()
                            .dealType(notiDealCategory.getDealType())
                            .build()
            );
        }

        payload.put("memberId",member.getId());
        payload.put("notiDongs",notiDongList);
        payload.put("categories",notiDealCategoryList);
        payload.put("notificationStart",member.getNotificationStart());
        payload.put("notificationEnd",member.getNotificationEnd());

        return new ResponseEntity<>(payload,HttpStatus.OK);
    }

    // 알림 설정
    @PostMapping("/set")
    public ResponseEntity<?> setAlarm(@RequestBody AlarmSettingDto.Request alarmDto){
        HashMap<String,Object> payload=new HashMap<>();

        MemberDto.Response response=memberSerivce.setMemberAlarm(alarmDto);

        payload.put("memberId",response.getId());
        payload.put("notiDongs",response.getNotiDongs());
        payload.put("categories",response.getNotiDealCategories());
        payload.put("notificationStart",response.getNotificationStart());
        payload.put("notificationEnd",response.getNotificationEnd());

        return new ResponseEntity<>(payload, HttpStatus.OK);
    }

}
