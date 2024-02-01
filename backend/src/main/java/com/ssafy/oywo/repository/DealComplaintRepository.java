package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.DealComplaint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DealComplaintRepository extends JpaRepository<DealComplaint, Long> {


}
