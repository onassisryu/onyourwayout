package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.MemberService;
import com.ssafy.oywo.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/notification")
public class NotificationController {

    private final MemberService memberService;
    private final NotificationService notificationService;

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotifications(@PathVariable("id") Long id) {
        MemberDto.Response memberDto = memberService.getMemberInfo(id);
        if(memberDto == null) {
            return ResponseEntity.badRequest().build();
        }
        List<NotificationDto.Response> notifications = notificationService.getNotificationsByMemberID(id);
        return ResponseEntity.ok(notifications);
    }

}
