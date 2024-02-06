package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.Notification;

import java.util.List;

public interface NotificationService {


    public void sendNotificationByDeal(Deal deal);

    public List<NotificationDto.Response> getNotifications();
}
