package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.Notification;

import java.util.List;

public interface NotificationService {


    public void sendNotificationByDeal(Deal deal);

    public void sendNotificationDealAccept(Deal deal);

    public List<NotificationDto.Response> getNotifications();

    public void deleteNotification(Long notificationId);

    public void deleteNotificationAll();

    public void readNotification(Long notificationId);

    public void readNotificationAll();

    public void checkNearDong(Long dongId);

    public void requestRecommendDeal(Deal deal, Member acceptMember);

    public void cancelRecommendDeal(Deal deal, Member acceptMember);

    public void sendNotificationOutRecommendDealAccept(Deal deal, Member acceptMember);
}
