package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.DealImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DealImageRepository extends JpaRepository<DealImage, Long> {

}
