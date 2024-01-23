package com.ssafy.oywo.repository;


import com.ssafy.oywo.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken,Long> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
    boolean existsByUserName(String userName);
    void deleteByUserName(String userName);

    boolean deleteByRefreshToken(String refreshToken);
}
