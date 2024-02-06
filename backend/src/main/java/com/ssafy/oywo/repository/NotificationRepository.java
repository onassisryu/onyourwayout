package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

    @Query("select n " +
            "from Notification n " +
            "join MembersNotification mn on n.id = mn.notification.id " +
            "where mn.member.id = :memberId")
    List<Notification> findByMemberId(Long memberId);

}
