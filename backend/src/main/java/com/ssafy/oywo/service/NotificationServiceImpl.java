package com.ssafy.oywo.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MulticastMessage;
import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aspectj.weaver.ast.Not;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final MembersNotificationRepository membersNotificationRepository;
    private final MemberRepository memberRepository;
    private final FirebaseMessaging firebaseMessaging;
    private final DealRepository dealRepository;
    private final HoRepository hoRepository;

    private final MemberService memberService;


    //알림 메시지로 member들에게 알림을 보내는 메소드
    private void sendMessage(Notification notification, List<Member> members, Map<String, String> data){
        List<String> tokens = members.stream().map(Member::getFcmToken).filter(Objects::nonNull).toList();

        try{
            firebaseMessaging.sendEachForMulticast(MulticastMessage.builder()
                    .addAllTokens(tokens)
                    .setNotification(com.google.firebase.messaging.Notification.builder()
                            .setTitle(notification.getTitle())
                            .setBody(notification.getMessage())
                            .build())
                    .putData("notificationId", notification.getId().toString())
                    .putAllData(data)
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
        Ho ho = hoRepository.findByMemberId(deal.getRequestId()); // deal 요청자의 동 정보 가져오기
        if(ho == null) throw new NoSuchElementException("해당하는 호가 없습니다.");

        List<Member> members = memberRepository.findByDongAndCategory(ho.getDong().getId(), deal.getDealType(), deal.getRequestId()); // deal 요청자의 동에 속한 멤버들 가져오기
        if(members.isEmpty()) return;

        members = members.stream().filter(member -> !Objects.equals(member.getId(), deal.getRequestId())).toList(); // deal 요청자는 제외

        Notification notification = Notification.builder()
                .title("[새로운 해줘요잉]")
                .message(ho.getDong().getName() + "동 "+ho.getName() +"호에서 새로운 해줘요잉이 등록되었습니다.")
                .notificationType(Notification.NotificationType.DEAL_NEW)
                .build();
        Notification notificationSaved = notificationRepository.save(notification);

        // map형 데이터 이후 추가
        Map<String, String> data = new HashMap<>();
        data.put("category", deal.getDealType().toString());

        sendMessage(notificationSaved, members, data);
    }

    /**
     * deal이 수락되거나 취소될 때, deal 요청자에게 알림을 보내는 메소드
     * @param deal
     * @return
     */
    public void sendNotificationDealAccept(Deal deal){
        Member member = memberRepository.findById(deal.getRequestId())
                .orElseThrow(() -> new NoSuchElementException("해당하는 멤버가 없습니다."));

        Notification notification = null;
        
        // 거래가 수락되었을 경우
        if(deal.getDealStatus() == Deal.DealStatus.ING){
            notification = Notification.builder()
                    .title("[해줘요잉 수락]")
                    .message(member.getNickname() + "님이 요청하신 해줘요잉이 수락되었습니다.")
                    .notificationType(Notification.NotificationType.DEAL_ACCEPT)
                    .build();
        }

        //거래가 취소되었을 경우
        if(deal.getDealStatus() == Deal.DealStatus.OPEN){
            notification = Notification.builder()
                    .title("[해줘요잉 수락 취소]")
                    .message(member.getNickname() + "님이 요청하신 해줘요잉의 수락이 취소되었습니다.")
                    .notificationType(Notification.NotificationType.DEAL_CANCEL)
                    .build();
        }

        if(notification == null) throw new NoSuchElementException("해당하는 알림이 없습니다.");

        Notification notificationSaved = notificationRepository.save(notification);

        Map<String, String> data = new HashMap<>();
        data.put("dealId",deal.getId().toString());

        sendMessage(notificationSaved, List.of(member), data);
    }

    /**
     * 로그인된 유저가 받은 알람 조회
     * @return List<NotificationDto.Response>
     */
    @Override
    public List<NotificationDto.Response> getNotifications() {
        Long id = memberService.getLoginUserId();
        List<Optional[]> notifications = notificationRepository.findByMemberId(id);

        List<NotificationDto.Response> responses = notifications.stream().map(notification -> {
            Notification noti = (Notification) notification[0].get();
            MembersNotification membersNotification = (MembersNotification) notification[1].get();
            return NotificationDto.Response.builder()
                    .id(noti.getId())
                    .title(noti.getTitle())
                    .message(noti.getMessage())
                    .isRead(membersNotification.isRead())
                    .notificationType(noti.getNotificationType())
                    .build();
        }).toList();

        return responses;
    }

    /**
     * 로그인된 유저가 받은 알람 삭제
     * @param notificationId
     */
    @Override
    public void deleteNotification(Long notificationId) {
        Long memberId = memberService.getLoginUserId();

        Optional<MembersNotification> membersNotification = membersNotificationRepository.findByNotificationIdAndMemberId(notificationId, memberId);
        if(membersNotification.isEmpty()) throw new NoSuchElementException("해당하는 알림이 없거나 이미 삭제된 알림입니다.");

        membersNotificationRepository.delete(membersNotification.get());
    }

    /**
     * 로그인된 유저가 받은 모든 알람 삭제
     */
    @Override
    public void deleteNotificationAll() {
        Long memberId = memberService.getLoginUserId();
        membersNotificationRepository.deleteAllByMemberId(memberId);
    }

    /**
     * 로그인된 유저가 받은 알람 읽음 처리
     * @param notificationId
     */
    @Override
    public void readNotification(Long notificationId) {
        Long memberId = memberService.getLoginUserId();

        Optional<MembersNotification> membersNotification = membersNotificationRepository.findByNotificationIdAndMemberId(notificationId, memberId);
        if(membersNotification.isEmpty()) throw new NoSuchElementException("해당하는 알림이 없거나 이미 삭제된 알림입니다.");

        membersNotification.get().setRead(true);
    }

    /**
     * 로그인된 유저가 받은 모든 알람 읽음 처리
     */
    @Override
    public void readNotificationAll() {
        Long memberId = memberService.getLoginUserId();
        List<MembersNotification> membersNotifications = membersNotificationRepository.findAllByMemberId(memberId);
        membersNotifications.forEach(membersNotification -> membersNotification.setRead(true));
    }

    @Override
    public void checkNearDong(Long dongId) {
        Long memberId = memberService.getLoginUserId();
        List<Deal> deals = dealRepository.findByDongIdAndMemberId(dongId, memberId);
    }
}
