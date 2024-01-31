package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.AlarmSettingDto;
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
import org.springframework.transaction.annotation.Transactional;
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

        MemberDto.Response member=memberService.getMemberInfo(id);

        // 존재하지 않는 사용자인 경우
        if(member!=null){
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        HashMap<String,Object> payload=new HashMap<>();
        payload.put("memberId",member.getId());
        payload.put("dongInfo",member.getNotiDongs());
        payload.put("categories",member.getNotiDealCategories());
        payload.put("notificationStart",member.getNotificationStart());
        payload.put("notificationEnd",member.getNotificationEnd());

        return new ResponseEntity<>(payload,HttpStatus.OK);
    }

    // 알림 설정
    @Transactional
    @PostMapping("/set")
    public ResponseEntity<?> setAlarm(AlarmSettingDto.Request alarmDto){
        HashMap<String,Object> payload=new HashMap<>();

        // 사용자 정보 가져오기
        MemberDto.Response memberDto=memberService.getMemberInfo(alarmDto.getMemberId());
        Member memberEntity=memberDto.toEntity();
        // 전체 동 알림 여부 확인
        if (alarmDto.isNotiDongAll()){
            // 사용자 정보 전체 동 알림으로 수정
            memberEntity=memberEntity.builder().isNotiDongAll(true).build();
        }
        else{

            List<NotiDong> dongList=new ArrayList<>();

            // 재설정
            for (Long dongId:alarmDto.getDongIdList()){
                dongList.add(NotiDong.builder().member(memberEntity).dongId(dongId).build());
            }
            memberEntity=memberEntity.builder().notiDongs(dongList).build();

        }
        // 전체 카테고리 알림 여부 확인
        if (alarmDto.isNotiDongAll()){
            // 사용자 정보 전체 카테고리 알림으로 수정
            memberEntity=memberEntity.builder().isNotiCategoryAll(true).build();
        }
        else{
            List<NotiDealCategory> notiDealCategoryList=new ArrayList<>();

            // 재설정
            for (DealType dealType:alarmDto.getDealTypeList()){
                notiDealCategoryList.add(NotiDealCategory.builder().member(memberEntity).dealType(dealType).build());
            }
            memberEntity=memberEntity.builder().notiDealCategories(notiDealCategoryList).build();
        }

        // 시작 시간과 마지막 시간 설정
        memberEntity=memberEntity.builder().notificationStart(alarmDto.getNotificationStart()).build();
        memberEntity=memberEntity.builder().notificationEnd(alarmDto.getNotificationEnd()).build();
        
        // member entity로 사용자 알림 정보 수정
        MemberDto.Response memberResponse=memberService.modify(memberEntity);

        // 사용자 아이디, 설정한 동 정보, 설정한 카테고리 유형, 시작시간과 마지막 시간 정보 response
        payload.put("memberId",memberResponse.getId());
        payload.put("dongInfo",memberResponse.getNotiDongs());
        payload.put("categories",memberResponse.getNotiDealCategories());
        payload.put("notificationStart",memberResponse.getNotificationStart());
        payload.put("notificationEnd",memberResponse.getNotificationEnd());

        return new ResponseEntity<>(payload, HttpStatus.OK);
    }

    // 알림 설정 수정
    @PutMapping("/set")
    public ResponseEntity<?> updateAlarm(AlarmSettingDto.Request alarmDto){
        HashMap<String,Object> payload=new HashMap<>();
        // 알림 정보를 수정할 사용자 정보 가져오기
        MemberDto.Response memberResponse=memberService.getMemberInfo(alarmDto.getMemberId());
        Member modifiedMember=null;

        if (memberResponse!=null){
            modifiedMember=memberResponse.toEntity();

            // 전체 동 알림 여부 확인
            if(alarmDto.isNotiDongAll()){
                modifiedMember=modifiedMember.builder().isNotiDongAll(true).build();
            }
            else{
                List<NotiDong> dongList=new ArrayList<>();

                // 재설정
                for (Long dongId:alarmDto.getDongIdList()){
                    dongList.add(NotiDong.builder().member(modifiedMember).dongId(dongId).build());
                }
                modifiedMember=modifiedMember.builder().notiDongs(dongList).build();
            }
            // 전체 카테고리 알림 여부 확인
            if (alarmDto.isNotiDongAll()){
                // 사용자 정보 전체 카테고리 알림으로 수정
                modifiedMember=modifiedMember.builder().isNotiCategoryAll(true).build();
            }
            else{
                List<NotiDealCategory> notiDealCategoryList=new ArrayList<>();

                // 재설정
                for (DealType dealType:alarmDto.getDealTypeList()){
                    notiDealCategoryList.add(NotiDealCategory.builder().member(modifiedMember).dealType(dealType).build());
                }
                modifiedMember=modifiedMember.builder().notiDealCategories(notiDealCategoryList).build();
            }

            // 시작 시간과 마지막 시간 설정
            modifiedMember=modifiedMember.builder().notificationStart(alarmDto.getNotificationStart()).build();
            modifiedMember=modifiedMember.builder().notificationEnd(alarmDto.getNotificationEnd()).build();

            MemberDto.Response memberResult=memberService.modify(modifiedMember);
            payload.put("memberId",memberResult.getId());
            payload.put("dongInfo",memberResult.getNotiDongs());
            payload.put("categories",memberResult.getNotiDealCategories());
            payload.put("notificationStart",memberResult.getNotificationStart());
            payload.put("notificationEnd",memberResult.getNotificationEnd());

            return new ResponseEntity<>(payload, HttpStatus.OK);
        }
        // 없는 사용자인 경우
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
