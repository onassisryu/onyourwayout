package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {


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
    @Query("SELECT d FROM Deal d " +
            "WHERE d.requestId IN " +
            "(SELECT hoMember.id FROM Ho ho " +
            " JOIN ho.member hoMember " +
            " JOIN ho.dong dong " +
            " JOIN dong.apartment apt " +
            " WHERE apt.id = (SELECT hoApt.id FROM Ho hoApt " +
            "                JOIN hoApt.member hoAptMember " +
            "                JOIN hoApt.dong hoAptDong " +
            "                JOIN hoAptDong.apartment hoAptApt " +
            "                WHERE hoAptMember.id = :memberId))")
    List<Deal> findDealsByMemberId(@Param("memberId") Long memberId);

//    List<Deal> findAllByOrderByModifiedAtDesc();
}
