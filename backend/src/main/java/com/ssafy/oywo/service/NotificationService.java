package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.NotificationDto;
import com.ssafy.oywo.entity.Notification;

import java.util.List;

public interface NotificationService {


    public List<NotificationDto.Response> getNotificationsByMemberID(Long id);
}
