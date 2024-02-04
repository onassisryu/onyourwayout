package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.AlarmSettingDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.NotiDealCategory;
import com.ssafy.oywo.entity.NotiDong;
import com.ssafy.oywo.service.MemberService;
import lombok.AllArgsConstructor;
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
@AllArgsConstructor
@RestController
@RequestMapping("/alarm")
public class AlarmController {

    private final MemberService memberSerivce;

    // 사용자 uuid로 설정한 알림 확인
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getAlarm(@PathVariable Long id){
        System.out.println(id);
        MemberDto.Response member=memberSerivce.getMemberInfo(id);

        // 존재하지 않는 사용자인 경우
        if(member==null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        return new ResponseEntity<>(member,HttpStatus.OK);
    }

    // 알림 설정
    @PostMapping("/set")
    public ResponseEntity<?> setAlarm(@RequestBody AlarmSettingDto.Request alarmDto){
        HashMap<String,Object> payload=new HashMap<>();

        // 사용자 정보 가져오기
        MemberDto.Response memberDto=memberSerivce.getMemberInfo(alarmDto.getMemberId());
        Member memberEntity=memberDto.toEntity();
        // 전체 동 알림 여부 확인
        if (alarmDto.getIsNotiCategoryAll()){
            // 사용자 정보 전체 동 알림으로 수정
            memberEntity=memberEntity.toBuilder().isNotiDongAll(true).build();
        }
        else{

            List<NotiDong> dongList=new ArrayList<>();

            // 재설정
            for (Long dongId:alarmDto.getDongIdList()){
                dongList.add(NotiDong.builder().member(memberEntity).dongId(dongId).build());
            }
            memberEntity=memberEntity.toBuilder().notiDongs(dongList).build();
        }
        // 전체 카테고리 알림 여부 확인
        if (alarmDto.getIsNotiDongAll()){
            // 사용자 정보 전체 카테고리 알림으로 수정
            memberEntity=memberEntity.toBuilder().isNotiCategoryAll(true).build();
        }
        else{
            List<NotiDealCategory> notiDealCategoryList=new ArrayList<>();

            // 재설정
            for (DealType dealType:alarmDto.getDealTypeList()){
                notiDealCategoryList.add(NotiDealCategory.builder().member(memberEntity).dealType(dealType).build());
            }
            memberEntity=memberEntity.toBuilder().notiDealCategories(notiDealCategoryList).build();
        }

        // 시작 시간과 마지막 시간 설정
        memberEntity=memberEntity.toBuilder().notificationStart(alarmDto.getNotificationStart()).build();
        memberEntity=memberEntity.toBuilder().notificationEnd(alarmDto.getNotificationEnd()).build();

        // member entity로 사용자 알림 정보 수정
        MemberDto.Response memberResponse=memberSerivce.modifyWithAlarm(memberEntity);
        return new ResponseEntity<>(memberResponse.of(memberEntity), HttpStatus.OK);
    }
}
