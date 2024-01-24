package com.ssafy.oywo.repository;


import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Dong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DongRepository extends JpaRepository<Dong, Long> {
    // 아파트 코드로 해당 아파트 동 정보 가져오기
    @Query("select new com.ssafy.oywo.dto.DongDto(d.id,d.name) from Dong d where d.apart.aptId=:apartId")
    List<DongDto> findByApartId(@Param("apartId") int apartId);
}
