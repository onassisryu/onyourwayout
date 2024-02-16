package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.DealDto;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.Deal;
import com.ssafy.oywo.entity.Ho;
import com.ssafy.oywo.entity.Member;
import com.ssafy.oywo.repository.DealComplaintRepository;
import com.ssafy.oywo.repository.DealRepository;
import com.ssafy.oywo.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminServiceImpl implements AdminService {

    private final MemberRepository memberRepository;
    private final DealRepository dealRepository;
    private final DealComplaintRepository dealComplaintRepository;


    @Override
    public List<MemberDto.Response> getNonCertifiedMembers() {
        List<Member> nonCertifiedMembers = memberRepository.findMembersByIsCertifiedIsFalseAndCertificationImgIsNotNull();

        List<MemberDto.Response> nonCertifiedMembersInfo=new ArrayList<>();

        for (Member member: nonCertifiedMembers){
            Ho ho=member.getHo();
            nonCertifiedMembersInfo.add(MemberDto.Response.of(member,ho));
        }
        return nonCertifiedMembersInfo;
    }

    @Override
    public MemberDto.Response getNonCertifiedMember(Long memberId) {
        Member member = memberRepository.findByIdAndIsCertifiedIsFalse(memberId)
                .orElseThrow(() -> new IllegalArgumentException("비인증 회원이 존재하지 않음"));
        Ho ho=member.getHo();
        return MemberDto.Response.of(member,ho);
    }

    @Transactional
    @Override
    public boolean verifyCertification(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("회원이 존재하지 않음"));

        // 인증 조건 여기에
        member.setCertified(true);
        memberRepository.save(member);
        return true;
    }


    @Override
    public List<DealDto.Response> getDealsWithComplaint() {

        List<Deal> deals = dealRepository.findDealsByComplaintGreaterThanOrderByComplaintDesc();


        return deals.stream()
                .map(d -> new DealDto.Response(d,
                        dealComplaintRepository.findDealComplaintByDealId(d.getId()),
                        memberRepository.findById(d.getRequestId()).orElseThrow(() -> new IllegalArgumentException("해당 requestId의 사용자가 없음"))))
                .collect(Collectors.toList());
    }


    @Override
    public DealDto.Response getDealWithComplaint(Long dealId) {

        return dealRepository.findById(dealId)
                .map(deal -> new DealDto.Response(deal,
                                dealComplaintRepository.findDealComplaintByDealId(deal.getId()),
                                memberRepository.findById(deal.getRequestId())
                                .orElseThrow(
                                        () -> new IllegalArgumentException("해당 requestId에 대한 사용자가 없음")
                                )))
                .orElseThrow(
                        () -> new IllegalArgumentException("해당 거래가 없음")
                );


    }


    @Override
    public List<MemberDto.Response> manageSuspendedMembers() {
        List<Member> members = memberRepository.findSuspendedMembers();
//        List<MemberDto> membersDto = new ArrayList<>();
//        members.forEach(i -> membersDto.add(new MemberDto.Request().toEntity(i)));
//        return membersDto;
        return members.stream()
                .map(MemberDto.Response::of)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public MemberDto.Response processUnlockMember(Long memberId) {
        Member member = memberRepository.findById(memberId).orElseThrow(
                () -> new IllegalArgumentException("없는 회원 입니다.")
        );
        boolean isSuspendedMember = validateUnlockMember(member);
        if (isSuspendedMember) {
            member.setPauseEndAt(null);
//            memberRepository.save(member);
            return MemberDto.Response.of(member);
        } else {
            throw new IllegalArgumentException("현재 이용 정지 중인 회원이 아닙니다.");
        }

    }

    @Transactional
    @Override
    public HashMap<String,Object> updatePenaltyAndPauseTime(Long memberId,Long dealId) {
        Member member=memberRepository.findById(memberId)
                .orElseThrow(()->new NoSuchElementException("찾을 수 없는 사용자입니다."));
        int penaltyCount=member.getPenaltyCount();
        // 페널티 카운트 수와 정지 기간(일) 비례
        member.setPenaltyCount(penaltyCount+1);
        LocalDateTime now=LocalDateTime.now();
        member.setPauseStartAt(Timestamp.valueOf(now));
        member.setPauseEndAt(Timestamp.valueOf(now.plusDays(member.getPenaltyCount())));

        HashMap<String,Object> payload=new HashMap<>();
        payload.put("memberId",member.getId());
        payload.put("nickName",member.getNickname());
        payload.put("penaltyCount",member.getPenaltyCount());
        payload.put("pauseStartAt",member.getPauseStartAt());
        payload.put("pauseEndAt",member.getPauseEndAt());

        memberRepository.save(member);

        Deal deal=dealRepository.findById(dealId)
                .orElseThrow(()->new NoSuchElementException("존재하지 않는 거래입니다."));
        dealRepository.deleteById(deal.getId());

        return payload;
    }

    @Transactional
    @Override
    public DealDto.Response changeStatusToOpen(Long dealId) {
        Deal deal=dealRepository.findById(dealId)
                .orElseThrow(()->new NoSuchElementException("찾을 수 없는 거래입니다."));
        deal.setComplaint(0);
        deal.setDealStatus(Deal.DealStatus.OPEN);
        return new DealDto.Response(dealRepository.save(deal));
    }

    public List<MemberDto.Response> getPausedMember(){
        List<Member> pausedMembers=memberRepository.findByPauseEndAtGreaterThan(LocalDateTime.now());
        List<MemberDto.Response> payload=new ArrayList<>();
        for (Member member:pausedMembers){
            Ho ho=member.getHo();
            payload.add(MemberDto.Response.of(member,ho));
        }
        return payload;
    }

    private boolean validateUnlockMember(Member member) {
        LocalDateTime now = LocalDateTime.now();
        if (member.getPauseStartAt() != null && member.getPauseEndAt() != null) {
            LocalDateTime pauseStartAt = member.getPauseStartAt().toLocalDateTime();
            LocalDateTime pauseEndAt = member.getPauseEndAt().toLocalDateTime();

            if (pauseStartAt.isBefore(now) && pauseEndAt.isAfter(now)) {
                // 현재 정지 상태인 경우
                return true;
            } else {
                // 정지 기간이 아닌 경우
                throw new IllegalArgumentException("현재 정지 기간이 아닙니다.");
            }
        } else {
            throw new IllegalArgumentException("현재 이용 정지된 회원이 아닙니다.");
        }
    }

}