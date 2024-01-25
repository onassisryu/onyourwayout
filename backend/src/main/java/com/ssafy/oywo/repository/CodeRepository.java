package com.ssafy.oywo.repository;


import com.ssafy.oywo.entity.Code;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeRepository extends JpaRepository<Code, Long> {
    Code findByCodeId(Long codeId);
}
