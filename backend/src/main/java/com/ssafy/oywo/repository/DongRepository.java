package com.ssafy.oywo.repository;


import com.ssafy.oywo.entity.Dong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DongRepository extends JpaRepository<Dong, Long> {
    // 아파트 코드로 해당 아파트 동 정보 가져오기
    @Query("select d from Dong d where d.apartId=:apartId")
    List<Dong> findByAptCode(@Param("apartId") String apartId);
}
