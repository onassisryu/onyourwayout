package com.ssafy.oywo.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.MembersNotification;
import com.ssafy.oywo.entity.Notification;
import com.ssafy.oywo.repository.MemberRepository;
import com.ssafy.oywo.repository.MembersNotificationRepository;
import com.ssafy.oywo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MembersNotificationRepository membersNotificationRepository;
    private final MemberRepository memberRepository;
    private final FirebaseMessaging firebaseMessaging;

    @Override
    public String sendNotificationByMemberId(NotificationDto.Request notificationDto, List<Long> memberId) {
        Notification notification = notificationDto.toEntity();
        notification = notificationRepository.save(notification);
        for(Long id : memberId){
            String token = memberRepository.findById(id).isPresent() ? memberRepository.findById(id).get().getFcmToken() : null;
            if(token == null) continue;

            Message message = Message.builder()
                    .setToken(token)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(notificationDto.getTitle())
                            .setBody(notificationDto.getMessage())
                            .build()
                    )
                    .build();
            try{
                firebaseMessaging.send(message);
                membersNotificationRepository.save(MembersNotification.builder()
                                .member(memberRepository.findById(id).get())
                                .notification(notification)
                        .build()
                );
            }catch (Exception e){
                log.error(e.getMessage());
                return "메시지 보내기 실패";
            }
        }
        return "메시지 보내기 성공";
    }

    @Override
    public List<NotificationDto.Response> getNotificationsByMemberID(Long id) {
        List<Notification> notifications = notificationRepository.findByMemberId(id);
        return notifications.stream().map(NotificationDto.Response::of).toList();
    }
}
