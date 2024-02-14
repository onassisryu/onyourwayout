package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.NotiDong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NotiDongRepository extends JpaRepository<NotiDong,Long> {
    void deleteAllByMemberId(Long memberId);

    @Query("select notiDong from NotiDong notiDong where notiDong.member.id= :memberId and notiDong.dongId= :dongId")
    Optional<NotiDong> findByMemberIdAndDongId(Long memberId, Long dongId);
}
