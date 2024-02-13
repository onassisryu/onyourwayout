package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.NotiDealCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotiDealCategoryRepository extends JpaRepository<NotiDealCategory,Long> {
    void deleteAllByMemberId(Long memberId);
}
