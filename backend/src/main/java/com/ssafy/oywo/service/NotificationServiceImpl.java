package com.ssafy.oywo.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.DongRepository;
import com.ssafy.oywo.repository.MemberRepository;
import com.ssafy.oywo.repository.MembersNotificationRepository;
import com.ssafy.oywo.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MembersNotificationRepository membersNotificationRepository;
    private final MemberRepository memberRepository;
    private final FirebaseMessaging firebaseMessaging;
    private final DongRepository dongRepository;


    //알림 메시지로 member들에게 알림을 보내는 메소드
    private void sendMessage(Notification notification, List<Member> members){
        for(Member member : members){
            String token = member.getFcmToken();
            if(token == null) continue;     //fcmToken이 없으면 메시지 보내지 않음

            Message message = Message.builder() //메시지 생성
                    .setToken(token)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(notification.getTitle())
                            .setBody(notification.getMessage())
                            .build()
                    )
                    .build();
            try{
                firebaseMessaging.send(message);
                membersNotificationRepository.save(MembersNotification.builder()
                                .member(member)
                                .notification(notification)
                        .build()
                );
            }catch (Exception e){
                log.error(e.getMessage());
                throw new RuntimeException("메시지 보내기 실패");
            }
        }
    }

    /**
     * deal이 생성될 때, deal 요청자의 동에 속한 멤버들에게 알림을 보내는 메소드
     * @param deal
     * @return
     */
    public String sendNotificationByDeal(Deal deal){
        Dong dong = dongRepository.findByMemberId(deal.getRequestId()); // deal 요청자의 동 정보 가져오기
        if(dong == null) throw new NoSuchElementException("해당하는 동이 없습니다.");

        List<Member> members = memberRepository.findByDong(dong.getId()); // deal 요청자의 동에 속한 멤버들 가져오기
        if(members.isEmpty()) throw new NoSuchElementException("해당하는 멤버가 없습니다.");


        Notification notification = Notification.builder()
                .title("해줘요잉 알림")
                .message(dong.getName() + "에 새로운 해줘요잉이 등록되었습니다.")
                .build();

        sendMessage(notification, members);
        return "메시지 보내기 성공";
    }

    @Override
    public List<NotificationDto.Response> getNotificationsByMemberID(Long id) {
        List<Notification> notifications = notificationRepository.findByMemberId(id);
        return notifications.stream().map(NotificationDto.Response::of).toList();
    }
}
