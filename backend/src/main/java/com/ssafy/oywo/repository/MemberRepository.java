package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByUsername(String username);
    boolean existsByUsername(String username);
    Optional<Member> findById(Long id);
    Member findByUsernameAndPassword(String username,String password);

    @Query("SELECT hoAptApt.id FROM Ho hoApt " +
            "JOIN hoApt.member hoAptMember " +
            "JOIN hoApt.dong hoAptDong " +
            "JOIN hoAptDong.apartment hoAptApt " +
            "WHERE hoAptMember.id = :memberId")
    Long findHoAptIdsByMemberId(@Param("memberId") Long memberId);


    // 정지 중 사용자
    @Query("SELECT m From Member m " +
            "WHERE m.pauseStartAt <= current_timestamp " +
            "AND m.pauseEndAt >= current_timestamp")
    List<Member> findSuspendedMembers();

    List<Member> findByCertifiedIsFalse();

    Optional<Member> findByIdAndCertifiedIsFalse(Long memberId);
}