package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.entity.NotiDong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NotiDongRepository extends JpaRepository<NotiDong,Long> {
    void deleteAllByMemberId(Long memberId);

    @Query(value = "select * from noti_dong n where n.member_id= :memberId and n.dong_id= :dongId"
    ,nativeQuery = true)
    Optional<NotiDong> findByMemberIdAndDongId(Long memberId, Long dongId);

    Optional<NotiDong> findByMemberAndDongId(Member member, Long dongId);
}
