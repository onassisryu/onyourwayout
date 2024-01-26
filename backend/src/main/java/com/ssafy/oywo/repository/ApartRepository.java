package com.ssafy.oywo.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ApartRepository extends JpaRepository<Apart, Long> {
    // 같은 법정동코드 내 이름을 포함하는 아파트 가져오는 쿼리
    @Query("select a from Apart a where a.areaCode=:code and a.name like %:name%")
    List<Apart> findByNameAndAreaCode(@Param("code") String areaCode, @Param("name") String name);

    List<Apart> findByAreaCode(String areaCode);
}
