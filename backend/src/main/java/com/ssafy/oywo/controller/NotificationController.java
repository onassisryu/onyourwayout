package com.ssafy.oywo.controller;

import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.service.MemberService;
import com.ssafy.oywo.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
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

    @Operation(summary = "사용자가 받은 알림조회", description = "사용자가 받은 전체 알림을 조회한다.")
    @GetMapping()
    public ResponseEntity<?> getNotifications() {
        List<NotificationDto.Response> notifications = notificationService.getNotifications();
        return ResponseEntity.ok(notifications);
    }

    @Operation(summary = "알림 삭제", description = "알림을 삭제한다.")
    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {
        try {
            notificationService.deleteNotification(notificationId);
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
        return ResponseEntity.ok("알림 삭제에 성공했습니다.");
    }



}
