package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.House;
import com.ssafy.oywo.entity.HouseId;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HouseRepository extends JpaRepository<House, HouseId> {
}
