package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.Member;
import jakarta.annotation.Nullable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member,Long> {
    Optional<Member> findByUsername(String username);

    Optional<Member> findByNickname(String nickname);

    boolean existsByUsername(String username);
    Optional<Member> findById(Long id);

    Member findByUsernameAndPassword(String username,String password);

    @Query("SELECT hoApt.id FROM Ho hoApt " +
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

    List<Member> findMembersByIsCertifiedIsFalse();

    Optional<Member> findByIdAndIsCertifiedIsFalse(Long memberId);

    // 이웃지수 높은 사용자
    List<Member> findMembersByOrderByScoreDesc();

    // 동 현재 거래의 requestID
    @Query("SELECT d.requestId FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " WHERE dong.id = :dongId) " +
            " AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            " AND d.dealStatus = :dealStatus" )
    List<Member> findDealsByRequestIdByDongIdAndDealTypeAndDealStatus(
            @Param("dongId") Long dongId,
            @Param("dealType") @Nullable List<DealType>  dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus
    );



    // 동별 알림 설정된 사용자
    @Query("SELECT m FROM Member m " +
            "JOIN m.ho ho " +
            "JOIN ho.dong dong " +
            "JOIN dong.apartment apt " +
            "WHERE apt.id = (select apt.id from Apartment apt Join Dong d on d.apartment = apt where d.id = :dongId) " +
            "AND (:dongId IN (SELECT d.id FROM m.notiDongs d) OR m.isNotiDongAll = true) " +
            "AND (:dealType IN(SELECT dt.dealType From m.notiDealCategories dt) OR m.isNotiCategoryAll = true)")
    List<Member> findByDongAndCategory(Long dongId, DealType dealType);

    Optional<Member> findByPhoneNumber(String phoneNumber);
}