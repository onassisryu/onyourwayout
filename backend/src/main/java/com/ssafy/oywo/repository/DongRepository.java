package com.ssafy.oywo.repository;


import com.ssafy.oywo.dto.DongDto;
import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DongRepository extends JpaRepository<Dong, Long> {
    // 아파트 코드로 해당 아파트 동 정보 가져오기
//    @Query("select new com.ssafy.oywo.dto.DongDto.Response(d.id, d.name, d.apartment) from Dong d where d.apartment.id=:apartId")
    List<Dong> findByApartment(Apartment apartment);
    Optional<Dong> findById(Long id);

    // 아파트 id로 동 정보 가져오기
    List<Dong> findByApartmentId(Long aptId);

}