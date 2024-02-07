package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.MembersNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MembersNotificationRepository extends JpaRepository<MembersNotification, Long> {

    Optional<MembersNotification> findByNotificationIdAndMemberId(Long notificationId, Long memberId);

    void deleteAllByMemberId(Long memberId);

    List<MembersNotification> findAllByMemberId(Long memberId);
}
