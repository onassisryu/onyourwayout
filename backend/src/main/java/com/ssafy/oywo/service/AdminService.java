package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Member;

import java.util.List;

public interface AdminService {

    List<MemberDto.Response> getNonCertifiedMembers();
    MemberDto.Response getNonCertifiedMember(Long memberId);
    boolean verifyCertification(Long memberId);

    List<DealDto.Response> getDealsWithComplaint();
    DealDto.Response getDealWithComplaint(Long dealId);


    List<MemberDto.Response> manageSuspendedMembers();
    MemberDto.Response processUnlockMember(Long memberId);


}