package com.ssafy.oywo.service;

import com.ssafy.oywo.dto.JwtToken;
import com.ssafy.oywo.dto.MemberDto;
import com.ssafy.oywo.entity.*;
import com.ssafy.oywo.jwt.JwtTokenProvider;
import com.ssafy.oywo.repository.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;

import javax.swing.text.html.Option;
import javax.swing.text.html.Option;
import java.sql.Timestamp;
import java.sql.Timestamp;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly=true)
@Slf4j
public class MemberServiceImpl implements MemberService {
    private final MemberRepository memberRepository;
    private final HoRepository hoRepository;
    private final DongRepository dongRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final NotiDongRepository notiDongRepository;
    private final NotiDealCategoryRepository notiDealCategoryRepository;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;
    private final JwtTokenProvider jwtTokenProvider;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    @Override
    public JwtToken signIn(String username, String password) throws HttpClientErrorException.Unauthorized {

        // 1. username + password 를 기반으로 Authentication 객체 생성
        // 이때 authentication 은 인증 여부를 확인하는 authenticated 값이 false
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(username, password);
        System.out.println("authenticationToken : " + authenticationToken);
        // 2. 실제 검증. authenticate() 메서드를 통해 요청된 Member 에 대한 검증 진행
        // authenticate 메서드가 실행될 때 CustomUserDetailsService 에서 만든 loadUserByUsername 메서드 실행
        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
        System.out.println("authenticationToken"+authenticationToken);
        // 3. 인증 정보를 기반으로 JWT 토큰 생성
        JwtToken jwtToken = jwtTokenProvider.generateToken(authentication);

        // 기존에 존재하는 refreshToken 삭제
        if (refreshTokenRepository.existsByUserName(username)) {
            log.info("기존에 존재하는 refreshToken 삭제");
            RefreshToken refreshToken=refreshTokenRepository.findByUserName(username)
                    .orElseThrow(()->new EntityNotFoundException());
            refreshTokenRepository.deleteById(refreshToken.getId());
        }
        RefreshToken refreshToken=RefreshToken.builder().userName(username).refreshToken(jwtToken.getRefreshToken()).build();
        refreshTokenRepository.save(refreshToken);

        return jwtToken;
    }

    @Transactional
    @Override
    public MemberDto.Response signUp(MemberDto.Request memberDto) {
        if (memberRepository.existsByUsername(memberDto.getUsername())) {
            throw new IllegalArgumentException("이미 사용 중인 사용자 이름입니다.");
        }

        // Password 암호화
        String encodedPassword = passwordEncoder.encode(memberDto.getPassword());
        List<String> roles = new ArrayList<>();
//        roles.add(Member.RoleType.ROLE_USER.name());  // USER 권한 부여
        roles.add("USER");  // USER 권한 부여

        // 먼저 회원 정보를 저장
        MemberDto.SignUp signup=new MemberDto.SignUp();
        Member member=null;

//        Long memberId=member.getId();                   // 저장된 회원 고유 id

        // 반환할 값
        MemberDto.Response response=null;

        String inviteCode=memberDto.getInviteCode();
        boolean isValidInviteCode=false;

        // 초대 코드를 기입한 경우
        if (!inviteCode.equals("")){
            Optional<Ho> ho=hoRepository.findByInviteCode(inviteCode);
            
            // 유효한 초대 코드인 경우
            if (ho.isPresent()){
                isValidInviteCode=true;
                member=memberRepository.save(signup.toEntity(memberDto,roles,true));
                // 해당하는 호에 회원 추가
                List<Member> members=ho.get().getMember();
                members.add(member);
                ho.get().builder().member(members).build();

                response=MemberDto.Response.of(member,ho.get());
            }
        }

        // 초대 코드를 기입하지 않은 경우 또는 유효하지 않은 초대 코드인 경우
        // 동 id와 호 이름으로 회원을 저장한다.
        else if (inviteCode.equals("") || !isValidInviteCode){
            member=memberRepository.save(signup.toEntity(memberDto,roles,false));
            Long dongId=memberDto.getDongId();
            String hoName=memberDto.getHoName();
            Optional<Ho> ho=hoRepository.findByDongIdAndName(dongId,hoName);
            // 이미 등록된 호가 있는 경우
            // 해당 호에 회원을 추가한다.
            if (ho.isPresent()){
                List<Member> members=ho.get().getMember();
                members.add(member);
                ho.get().builder().member(members).build();

                response=MemberDto.Response.of(member,ho.get());
                member.setHo(ho.get());
            }
            // 등록되지 않은 호인 경우
            else{
                // 새로운 호를 만들어서 저장한다.
                Dong dong=dongRepository.findById(dongId)
                        .orElseThrow(()->new RuntimeException("해당 동을 찾을 수 없습니다."));
                List<Member> members=new ArrayList<>();
                members.add(member);
                // 새로운 호에는 동 정보, 호 이름, 해당 호에 살고 있는 거주자 리스트, 초대 코드를 함께 저장
                UUID uuid=UUID.nameUUIDFromBytes(String.valueOf(System.currentTimeMillis()).getBytes());
                String newInviteCode=uuid.toString().replaceAll("-","");
                Ho newHo= Ho.builder().dong(dong).name(hoName).member(members).inviteCode(newInviteCode).build();
                newHo=hoRepository.save(newHo);
                member.setHo(newHo);
                response= MemberDto.Response.of(member, newHo);
            }
        }
        return response;
    }

    public Optional<RefreshToken> getRefreshToken(String refreshToken){
        return refreshTokenRepository.findByRefreshToken(refreshToken);
    }
    public Map<String,String> validateRefreshToken(String refreshToken){
        // 결과를 담을 hashmap
        Map<String,String> map=new HashMap<>();
        String createdAccessToken= jwtTokenProvider.validateRefreshToken(refreshToken);

        // refreshToken이 만료되었을 경우
        if (createdAccessToken==null){
            map.put("status","402");
            map.put("message","Refresh 토큰이 만료되었습니다. 로그인이 필요합니다.");

        }
        // refreshToken이 만료 전인 경우
        else{
            map.put("status","200");
            map.put("message","Refresh 토큰을 통한 Access Token 생성이 완료되었습니다.");
            map.put("accessToken",createdAccessToken);
        }
        return map;

    }

    @Transactional
    @Override
    public MemberDto.Response modify(Long id,MemberDto.Request memberDto) {

        Optional<Member> member=memberRepository.findById(id);

        if (member.isPresent()){
            Member existedMember=member.get()
                    .toBuilder()
                    .username(memberDto.getUsername())
                    .nickname(memberDto.getNickname())
                    .phoneNumber(memberDto.getPhoneNumber())
                    .birthDate(memberDto.getBirthDate())
                    .password(memberDto.getPassword())
                    .score(member.get().getScore())
                    .build();;
            existedMember=memberRepository.save(existedMember);


            Long hoId=memberRepository.findHoAptIdsByMemberId(member.get().getId());
            Ho ho=hoRepository.findById(hoId)
                    .orElseThrow(()->new NoSuchElementException("존재하지 않는 호입니다."));

            MemberDto.Response response=MemberDto.Response.of(existedMember,ho);

            return response;
        }
        return null;
    }
    @Transactional
    @Override
    public MemberDto.Response modifyWithAlarm(Member member) {
        // 기존에 저장된 알림을 가져온다.
        Member originMember=memberRepository.findById(member.getId())
                .orElseThrow(()->new NoSuchElementException("존재하지 않는 사용자입니다."));
        List<NotiDong> originNotiDongs=originMember.getNotiDongs();
        List<NotiDealCategory> originNotiDealCategories=originMember.getNotiDealCategories();
        // 기존 알림을 지운다.
        for (NotiDong notiDong:originNotiDongs){
            notiDongRepository.delete(notiDong);
        }
        for (NotiDealCategory category:originNotiDealCategories){
            notiDealCategoryRepository.delete(category);
        }
        memberRepository.save(member);
        if (!member.isNotiDongAll()){
            for (NotiDong notiDong:member.getNotiDongs()){
                notiDongRepository.save(notiDong);
            }
        }
        if (!member.isNotiCategoryAll()){
            for (NotiDealCategory category:member.getNotiDealCategories()){
                notiDealCategoryRepository.save(category);
            }
        }
        return MemberDto.Response.of(member);
    }

    @Transactional
    @Override
    public MemberDto.Response modify(Member member){
        for (int i=0;i<member.getNotiDongs().size();i++){
            System.out.println(member.getNotiDongs().get(i).getDongId());
        }
        Member modifiedMember=memberRepository.save(member);
        for (int i=0;i<modifiedMember.getNotiDongs().size();i++){
            System.out.println(modifiedMember.getNotiDongs().get(i).getDongId());
        }
        System.out.println(modifiedMember.getNotiDongs());

        //System.out.println(modifiedMember.getNotiDealCategories());
        return MemberDto.Response.of(modifiedMember);
    }

    @Transactional
    @Override
    public void logout(String username) {
        Optional<RefreshToken> refreshToken=refreshTokenRepository.findByUserName(username);

        if (refreshToken.isPresent()){
            refreshTokenRepository.deleteById(refreshToken.get().getId());
        }
    }

    @Override
    public MemberDto.Response getMemberInfo(String username, String password) {
        Member member=memberRepository.findByUsernameAndPassword(username,password);
        List<NotiDong> notiDongs=new ArrayList<>();
        List<NotiDealCategory> notiDealCategories=new ArrayList<>();

        for (NotiDong notiDong:member.getNotiDongs()){
            if (notiDong.getDeletedAt()==null){
                notiDongs.add(notiDong);
            }
        }

        for (NotiDealCategory category:member.getNotiDealCategories()){
            if (category.getDeletedAt()==null){
                notiDealCategories.add(category);
            }
        }
        member=member.toBuilder().notiDongs(notiDongs).notiDealCategories(notiDealCategories).build();
        return MemberDto.Response.of(member);
    }

    @Override
    public MemberDto.Response getMemberInfo(Long id) {
        Optional<Member> member=memberRepository.findById(id);
        if (member.isPresent()){
            Member m=member.get();
            List<NotiDong> notiDongs=new ArrayList<>();
            List<NotiDealCategory> notiDealCategories=new ArrayList<>();

            for (NotiDong notiDong:m.getNotiDongs()){
                if (notiDong.getDeletedAt()==null){
                    notiDongs.add(notiDong);
                }
            }

            for (NotiDealCategory category:m.getNotiDealCategories()){
                if (category.getDeletedAt()==null){
                    notiDealCategories.add(category);
                }
            }
            m=m.toBuilder().notiDongs(notiDongs).notiDealCategories(notiDealCategories).build();
            return MemberDto.Response.of(m);
        }
        return null;
    }

    @Override
    public Long getHoIdByMemberId(Long memberId) {
        return memberRepository.findHoAptIdsByMemberId(memberId);
    }

    @Transactional
    @Override
    public void saveFcmToken(Long memberId, String fcmToken) {
        Member member=memberRepository.findById(memberId)
                .orElseThrow(()->new EntityNotFoundException("없는 사용자 입니다."));
        member=member.toBuilder().fcmToken(fcmToken).build();
        memberRepository.save(member);
    }

    @Transactional
    @Override
    public List<String> getFcmTokens(List<Long> memberIdList) {
        List<String> fcmTokens=new ArrayList<>();
        for(Long id:memberIdList){
            Optional<Member> member=memberRepository.findById(id);
            if (member.isPresent()){
                fcmTokens.add(member.get().getFcmToken());
            }
        }
        return fcmTokens;
    }

    @Override
    public void removeFcmToken(String username) {
        Member member=memberRepository.findByUsername(username)
                .orElseThrow(NoSuchElementException::new);
        member=member.toBuilder().fcmToken(null).build();
        memberRepository.save(member);
    }

    @Override
    public HashMap<String, Object> findHoByInviteCode(String inviteCode) {
        HashMap<String,Object> payload=new HashMap<>();
        Optional<Ho> ho=hoRepository.findByInviteCode(inviteCode);

        if (ho.isPresent()){
            payload.put("hoId",ho.get().getId());
            payload.put("hoName",ho.get().getName());
            payload.put("dongId",ho.get().getDong().getId());
            payload.put("dongName",ho.get().getDong().getName());
            payload.put("apartName",ho.get().getDong().getApartment().getName());
            payload.put("apartId",ho.get().getDong().getApartment().getId());
            return payload;
        }
        return null;


    }

    @Override
    public boolean isExistUserName(String userName) {
        Optional<Member> member=memberRepository.findByUsername(userName);
        if (member.isPresent()){
            return true;
        }
        return false;
    }

    @Override
    public boolean isExistNickName(String nickName) {
        Optional<Member> member=memberRepository.findByNickname(nickName);
        if (member.isPresent()){
            return true;
        }
        return false;
    }

    @Override
    public boolean isExistPhoneNumber(String phoneNumber) {
        Optional<Member> member=memberRepository.findByPhoneNumber(phoneNumber);
        if (member.isPresent()){
            return true;
        }
        return false;
    }


}
