package com.ssafy.oywo.repository;


import org.springframework.data.jpa.repository.JpaRepository;

public interface CodeRepository extends JpaRepository<Code, Long> {
    Code findByCodeId(Long codeId);
}
