package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealType;
import jakarta.annotation.Nullable;
import org.hibernate.annotations.ParamDef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    // apt_id 가져오기
    @Query("SELECT hoAptApt.id FROM Ho hoApt " +
            "JOIN hoApt.member hoAptMember " +
            "JOIN hoApt.dong hoAptDong " +
            "JOIN hoAptDong.apartment hoAptApt " +
            "WHERE hoAptMember.id = :memberId")
    Long findHoAptIdsByMemberId(@Param("memberId") Long memberId);


    // apt_id로  전체 거래 들고오기
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " JOIN dong.apartment apt " +
            " WHERE apt.id = :apartmentId)" +
            " AND d.dealStatus = :dealStatus")
    List<Deal> findDealsByApartmentId(@Param("apartmentId") Long apartmentId,
                                      @Param("dealStatus") Deal.DealStatus dealStatus);


    // apt_id로 필터링된(dealType) 거래 들고오기(OPEN 거래만)
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " JOIN dong.apartment apt " +
            " WHERE apt.id = :apartmentId) " +
            " AND (:dealType IS NULL OR d.dealType = :dealType) " +
            " AND d.dealStatus = :dealStatus" )
    List<Deal> findDealsByApartmentIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dealType") @Nullable DealType dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus
    );


    // 각 동별 거래 조회
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.dong dong " +
            " JOIN ho.member hoMember " +
            " WHERE dong.apartment.id = :apartmentId" +
            " AND (:dongId IS NULL OR dong.id = :dongId)) " +
            " AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            " AND d.dealStatus = :dealStatus")
    List<Deal> findDealsByDongIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dongId") @Nullable Long dongId,
            @Param("dealType") @Nullable List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus
    );
//    @Query("SELECT d FROM Deal d " +
//            "WHERE d.requestId IN " +
//            "(SELECT hoMember.id FROM Ho ho " +
//            " JOIN ho.dong dong " +
//            " JOIN ho.member hoMember " +
//            " WHERE dong.apartment.id = :apartmentId" +
//            " AND (:dongId IS NULL OR dong.id = :dongId)) " +
//            " AND (:dealType IS NULL OR d.dealType = :dealType) " +
//            " AND d.dealStatus = :dealStatus")
//    List<Deal> findDealsByDongIdAndDealType(
//            @Param("apartmentId") Long apartmentId,
//            @Param("dongId") @Nullable Long dongId,
//            @Param("dealType") @Nullable DealType dealType,
//            @Param("dealStatus") Deal.DealStatus dealStatus
//    );


    // 동별 거래 건수
    @Query("SELECT COUNT(d) FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.dong dong " +
            " JOIN ho.member hoMember " +
            " WHERE dong.apartment.id = :apartmentId " +
            " AND (:dongId IS NULL OR dong.id = :dongId)) " +
            " AND (:dealType IS NULL OR d.dealType IN :dealType) " +
            " AND d.dealStatus = :dealStatus")
    Long countDealsByDongIdAndDealType(
            @Param("apartmentId") Long apartmentId,
            @Param("dongId") @Nullable Long dongId,
            @Param("dealType") @Nullable List<DealType> dealType,
            @Param("dealStatus") Deal.DealStatus dealStatus
    );




    // member_id로 사용자별 요청한(requestId) 전체 거래 들고오기
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId = :memberId")
    List<Deal> findDealsByRequestId(@Param("memberId") Long memberId);


    // member_id로 사용자별 수행한(acceptId) 전체 거래 들고오기
    @Query("SELECT d FROM Deal d " +
            "WHERE d.acceptId = :memberId")
    List<Deal> findDealsByAcceptId(@Param("memberId") Long memberId);



//    List<Deal> findAllByOrderByModifiedAtDesc();
}

    // 내 아파트 deal만
//    @Query("SELECT d FROM Deal d " +
//            "WHERE d.requestId IN " +
//            "(SELECT h.member.id FROM House h " +
//            " JOIN Ho ho ON h.ho.id = ho.id " +
//            " JOIN Dong dong ON ho.dong.id = dong.id " +
//            " JOIN Apartment a ON dong.apartment.id = a.id " +
//            " WHERE a.id IN (SELECT a2.id FROM House h2 " +
//            "                JOIN Ho ho2 ON h2.ho.id = ho2.id " +
//            "                JOIN Dong dong2 ON ho2.dong.id = dong2.id " +
//            "                JOIN Apartment a2 ON dong2.apartment.id = a2.id " +
//            "                WHERE h2.member.id = :memberId))")


//    @Query("SELECT d FROM Deal d " +
//            "WHERE d.requestId IN " +
//            "(SELECT hoMember.id FROM Ho ho " +
//            " JOIN ho.member hoMember " +
//            " JOIN ho.dong dong " +
//            " JOIN dong.apartment apt " +
//            " WHERE apt.id = (SELECT hoApt.id FROM Ho hoApt " +
//            "                JOIN hoApt.member hoAptMember " +
//            "                JOIN hoApt.dong hoAptDong " +
//            "                JOIN hoAptDong.apartment hoAptApt " +
//            "                WHERE hoAptMember.id = :memberId))")
//    List<Deal> findDealsByMemberId(@Param("memberId") Long memberId);