package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.NotiDealCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NotiDealCategoryRepository extends JpaRepository<NotiDealCategory,Long> {
    void deleteAllByMemberId(Long memberId);

    @Query("select n from NotiDealCategory n where n.member.id= :memberId and n.dealType= :dealType")
    Optional<NotiDealCategory> findByMemberIdAAndDealType(Long memberId, DealType dealType);
}
