package com.ssafy.oywo.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Objects;

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
    private final HoRepository hoRepository;


    //알림 메시지로 member들에게 알림을 보내는 메소드
    private void sendMessage(Notification notification, List<Member> members){
        List<String> tokens = members.stream().map(Member::getFcmToken).filter(Objects::nonNull).toList();

        try{
            firebaseMessaging.sendEachForMulticast(MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(notification.getTitle())
                            .setBody(notification.getMessage())
                            .build())
                    .build());

            membersNotificationRepository.saveAll(members.stream().map(member -> MembersNotification.builder()
                    .member(member)
                    .notification(notification)
                    .build())
                    .toList());
        }catch (Exception e){
            log.error(e.getMessage());
        }
    }

    /**
     * deal이 생성될 때, deal 요청자의 동에 속한 멤버들에게 알림을 보내는 메소드
     * @param deal
     * @return
     */
    public void sendNotificationByDeal(Deal deal){
        System.out.println(deal.getRequestId());
        Ho ho = hoRepository.findByMemberId(deal.getRequestId()); // deal 요청자의 동 정보 가져오기
        System.out.println(ho);
        if(ho == null) throw new NoSuchElementException("해당하는 호가 없습니다.");

        List<Member> members = memberRepository.findByDongAndCategory(ho.getDong().getId(), deal.getDealType()); // deal 요청자의 동에 속한 멤버들 가져오기
        if(members.isEmpty()) throw new NoSuchElementException("해당하는 멤버가 없습니다.");

        members = members.stream().filter(member -> !Objects.equals(member.getId(), deal.getRequestId())).toList(); // deal 요청자는 제외

        Notification notification = Notification.builder()
                .title("[해줘요잉]")
                .message(ho.getDong().getName() + "동 "+ho.getName() +"호에서 새로운 해줘요잉이 등록되었습니다.")
                .build();
        Notification notificationSaved = notificationRepository.save(notification);

        sendMessage(notificationSaved, members);
    }

    @Override
    public List<NotificationDto.Response> getNotificationsByMemberID(Long id) {
        List<Notification> notifications = notificationRepository.findByMemberId(id);
        return notifications.stream().map(NotificationDto.Response::of).toList();
    }
}
