package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.MembersNotification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MembersNotificationRepository extends JpaRepository<MembersNotification, Long> {

    MembersNotification findByNotificationIdAndMemberId(Long notificationId, Long memberId);

}
