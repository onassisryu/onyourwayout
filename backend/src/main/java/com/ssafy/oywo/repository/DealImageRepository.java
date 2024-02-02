package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.DealImage;
import com.ssafy.oywo.entity.DealType;
import jakarta.persistence.PreRemove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DealImageRepository extends JpaRepository<DealImage, Long> {

    @Query("SELECT i FROM DealImage i WHERE i.deal.id = :dealId")
    List<DealImage> findByDealId(@Param("dealId") Long dealId);
}
