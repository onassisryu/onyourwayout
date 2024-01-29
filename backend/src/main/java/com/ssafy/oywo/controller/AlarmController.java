package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.AlarmDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.NotiDealCategory;
import com.ssafy.oywo.entity.NotiDong;
import com.ssafy.oywo.repository.MemberRepository;
import com.ssafy.oywo.service.MemberService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/alarm")
public class AlarmController {

    private static MemberService memberService;

    // 사용자 uuid로 설정한 알림 확인
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getAlarm(@PathVariable Long id){

        Optional<Member> member=memberService.getMemberInfo(id);

        // 존재하지 않는 사용자인 경우
        if(!member.isPresent()){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HashMap<String,Object> payload=new HashMap<>();
        payload.put("memberId",member.get().getId());
        payload.put("dongInfo",member.get().getNotiDongs());
        payload.put("categories",member.get().getNotiDealCategories());
        payload.put("notificationStart",member.get().getNotificationStart());
        payload.put("notificationEnd",member.get().getNotificationEnd());

        return new ResponseEntity<>(payload,HttpStatus.OK);
    }

    // 알림 설정
    @PostMapping("/set")
    public ResponseEntity<?> setAlarm(AlarmDto.Setting alarmDto){
        HashMap<String,Object> payload=new HashMap<>();

        // 사용자 정보 가져오기
        Member member=memberService.getMemberInfo(alarmDto.getMemberId()).get();
        
        // 전체 동 알림 여부 확인
        if (alarmDto.isNotiDongAll()){
            // 사용자 정보 전체 동 알림으로 수정
            member.builder().isNotiDongAll(true).build();
        }
        else{

            List<NotiDong> dongList=new ArrayList<>();

            // 재설정
            for (Long dongId:alarmDto.getDongIdList()){
                dongList.add(NotiDong.builder().member(member).dongId(dongId).build());
            }
            member.builder().notiDongs(dongList);

        }
        // 전체 카테고리 알림 여부 확인
        if (alarmDto.isNotiDongAll()){
            // 사용자 정보 전체 카테고리 알림으로 수정
            member.builder().isNotiCategoryAll(true).build();
        }
        else{
            List<NotiDealCategory> notiDealCategoryList=new ArrayList<>();

            // 재설정
            for (DealType dealType:alarmDto.getDealTypeList()){
                notiDealCategoryList.add(NotiDealCategory.builder().member(member).dealType(dealType).build());
            }
            member.builder().notiDealCategories(notiDealCategoryList);
        }

        // 시작 시간과 마지막 시간 설정
        member.builder().notificationStart(alarmDto.getNotificationStart());
        member.builder().notificationEnd(alarmDto.getNotificationEnd());

        // member=memberService.modify(member);

        // 사용자 아이디, 설정한 동 정보, 설정한 카테고리 유형, 시작시간과 마지막 시간 정보 response
        payload.put("memberId",member.getId());
        payload.put("dongInfo",member.getNotiDongs());
        payload.put("categories",member.getNotiDealCategories());
        payload.put("notificationStart",member.getNotificationStart());
        payload.put("notificationEnd",member.getNotificationEnd());

        return new ResponseEntity<>(payload, HttpStatus.OK);
    }
}
