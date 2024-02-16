package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface NotificationRepository extends JpaRepository<Notification, Long>{

    @Query("select n, mn " +
            "from Notification n " +
            "join MembersNotification mn on n.id = mn.notification.id " +
            "where mn.member.id = :memberId AND mn.deletedAt IS NULL " +
            "ORDER BY n.createdAt DESC")
    List<Optional[]> findByMemberId(Long memberId);

}
