package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.DealComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealComplaintRepository extends JpaRepository<DealComplaint, Long> {

    // 거래 신고 내역
    @Query("SELECT dc FROM DealComplaint dc " +
            "WHERE dc.deal.id = :dealId")
    List<DealComplaint> findDealComplaintByDealId(@Param("dealId") Long dealId);

}