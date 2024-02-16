package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.DealType;
import com.ssafy.oywo.entity.NotiDealCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface NotiDealCategoryRepository extends JpaRepository<NotiDealCategory,Long> {
    void deleteAllByMemberId(Long memberId);

    @Query(value = "select * from noti_deal_category n where n.member_id= :memberId and n.deal_type= :dealType",
    nativeQuery = true)
    Optional<NotiDealCategory> findByMemberIdAndDealType(Long memberId, DealType dealType);
}
