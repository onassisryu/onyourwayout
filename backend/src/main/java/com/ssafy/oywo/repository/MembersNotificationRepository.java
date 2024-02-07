package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.MembersNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MembersNotificationRepository extends JpaRepository<MembersNotification, Long> {

    Optional<MembersNotification> findByNotificationIdAndMemberId(Long notificationId, Long memberId);

}
