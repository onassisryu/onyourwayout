package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    // apt_id 가져오기
    @Query("SELECT hoApt.id FROM Ho ho " +
            "JOIN ho.member hoMember " +
            "JOIN ho.dong hoDong " +
            "JOIN hoDong.apartment hoApt " +
            "WHERE hoMember.id = :memberId")
    Long findHoAptIdsByMemberId(@Param("memberId") Long memberId);

    // dong_id 가져오기
    @Query("SELECT hoDong.id FROM Ho ho " +
            "JOIN ho.member hoMember " +
            "JOIN ho.dong hoDong " +
            "WHERE hoMember.id = :memberId")
    Long findDongIdByMemberId(@Param("memberId") Long memberId);


    // apt_id로  전체 거래 들고오기
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " JOIN dong.apartment apt " +
            " WHERE apt.id = :apartmentId)" +
            " AND d.dealStatus = :dealStatus" +
            " AND d.expireAt > CURRENT_TIMESTAMP" +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId) " +
            " ORDER BY d.createdAt DESC ")
    List<Deal> findDealsByApartmentId(@Param("apartmentId") Long apartmentId,
                                      @Param("dealStatus") Deal.DealStatus dealStatus,
                                      @Param("memberId") Long memberId);


    // apt_id로 필터링된(dealType) 거래 들고오기(OPEN/만료 안된 거래만)
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " JOIN dong.apartment apt " +
            " WHERE apt.id = :apartmentId) " +
            " AND (:dealType IS NULL OR d.dealType = :dealType) " +
            " AND d.dealStatus = :dealStatus" +
            " AND d.expireAt > CURRENT_TIMESTAMP" +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId)" +
            " ORDER BY d.createdAt DESC ")
    List<Deal> findDealsByApartmentIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dealType") @Nullable DealType dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus,
            @Param("memberId") Long memberId);


    // dong_id로 필터링된(dealType) 거래 들고오기(OPEN 거래만)
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.dong dong " +
            " JOIN ho.member hoMember " +
            " WHERE dong.id = :dongId) " +
            " AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            " AND d.dealStatus = :dealStatus" +
            " AND d.expireAt > CURRENT_TIMESTAMP" +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId)" +
            " ORDER BY d.createdAt DESC ")
    List<Deal> findDealsByDongIdAndDealTypeAndDealStatus(
            @Param("dongId") Long dongId,
            @Param("dealType") @Nullable List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus,
            @Param("memberId") Long memberId);


    // 각 동별 거래 조회
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.dong dong " +
            " JOIN ho.member hoMember " +
            " JOIN dong.apartment apt " +
            " WHERE (ho.dong.apartment.id = :apartmentId)" +
            " AND (:dongId IS NULL OR ho.dong.id = :dongId))" +
            " AND (:dealType IS NULL OR d.dealType IN :dealType)" +
            " AND d.dealStatus = :dealStatus" +
            " AND d.expireAt > current_timestamp " +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId)" +
            " ORDER BY d.createdAt DESC ")
    List<Deal> findDealsByDongIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dongId") @Nullable Long dongId,
            @Param("dealType") @Nullable List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus,
            @Param("memberId") Long memberId);


    // 동별 거래 건수
    @Query("SELECT COUNT(d) FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.dong dong " +
            " JOIN ho.member hoMember " +
            " WHERE dong.apartment.id = :apartmentId " +
            " AND (:dongId IS NULL OR dong.id = :dongId)) " +
            " AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            " AND d.dealStatus = :dealStatus" +
            " AND d.expireAt > current_timestamp" +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId)" +
            " ORDER BY d.createdAt DESC ")
    Long countDealsByDongIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dongId") @Nullable Long dongId,
            @Param("dealType") @Nullable List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus,
            @Param("memberId") Long memberId);


    // member_id로 사용자별 요청한(requestId) 전체 거래 들고오기
    List<Deal> findDealsByRequestIdOrderByCreatedAtDesc(@Param("memberId") Long memberId);

    // member_id로 사용자별 수행한(acceptId) 전체 거래 들고오기
    List<Deal> findDealsByAcceptIdOrderByCreatedAtDesc(Long memberId);

    // reuqest_id와 accept_id로 현재 거래 들고오기(최신 1개)
    Optional<Deal> findTopByRequestIdAndAcceptIdAndDealStatusOrderByModifiedAtDesc(
            Long requestId,
            Long acceptId,
            Deal.DealStatus dealStatus
    );

    // 수락 기능 제한
    List<Deal> findDealsByAcceptIdAndDealStatus(Long acceptId, Deal.DealStatus dealStatus);

    // 현재 수락한 해줘요잉 개수
    Long countDealsByAcceptIdAndDealStatus(Long acceptId, Deal.DealStatus dealStatus);

    // 신고 수에 따른 거래 내림차순
    List<Deal> findDealsByOrderByComplaintDesc();

    // RequestId의 완료된 거래
    Long countDealsByRequestIdAndDealStatus(Long requestId, Deal.DealStatus dealStatus);

    // created_at으로 조회
    List<Deal> findDealsByOrderByCreatedAtDesc();

    // 완료된 거래
    Long countDealsByRequestIdOrAcceptIdAndDealStatus(Long requestId, Long acceptId, Deal.DealStatus dealStatus);

    // 전체 거래 수
    Long countDealsByRequestIdOrAcceptId(Long requestId, Long acceptId);
    // 전체 거래 조회
    @Query("SELECT d FROM Deal d " +
            "WHERE (d.requestId = :requestId) " +
            "AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            "AND d.dealStatus = :dealStatus " +
            "AND d.expireAt > CURRENT_TIMESTAMP" +
            " AND d.requestId NOT IN " +
            "(SELECT bm.blockMemberId.id FROM BlockMembers bm " +
            " WHERE bm.memberId.id = :memberId)")
    List<Deal> findDealsByRequestIdAndDealTypeAndDealStatus(
            @Param("requestId") Long requestId,
            @Param("dealType") List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus,
            @Param("memberId") Long memberId);

    List<Deal> findTop3DealsByRequestIdOrAcceptIdAndDealStatusOrderByCreatedAtDesc(
            Long requestId,
            Long acceptId,
            Deal.DealStatus dealStatus
    );
    // 요청자로서 거래 수
    Long countDealsByRequestId(Long memberId);
    // 수락자로서 거래 수
    Long countDealsByAcceptId(Long memberId);
    // 특정 사용자끼리 거래 수
    Long countDealsByRequestIdAndAcceptId(Long requestId, Long acceptId);

    //해당 동에 있는 사용자들의 거래 조회(블락된 사용자, 자신 제외)
    @Query("SELECT d FROM Deal d " +
            "JOIN Member m ON d.requestId = m.id " +
            "WHERE m in (Select ho.member from Ho ho Join Dong dong on ho.dong = dong where dong.id = :dongId) " +
            "AND m not in (Select bm.blockMemberId from BlockMembers bm where bm.memberId.id = :memberId)" +
            "AND m.id <> :memberId " +
            "ORDER BY d.createdAt DESC")
    List<Deal> findByDongIdAndMemberId(Long dongId, Long memberId);

}