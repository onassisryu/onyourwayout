package com.ssafy.oywo.repository;


import com.ssafy.oywo.entity.Ho;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HoRepository extends JpaRepository<Ho,Long> {
    // 초대 코드로 아파트 id 가져오기
    Optional<Ho> findByInviteCode(String inviteCode);
    // 동 id와 호 이름으로 호 정보 가져오기
    Optional<Ho> findByDongIdAndName(String dongId, String name);

}
