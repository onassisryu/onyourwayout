package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.*;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;


import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


public class MemberDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private String nickname;                    // 이름
        private String username;                // 사용자 이메일
        private String password;                // 비밀번호

        private String inviteCode;              // 인증 코드
        private boolean isNotiDongAll;          // 전체 동 알림 여부
        private boolean isNotiCategoryAll;      // 전체 유형 알림 여부
        private String fcmToken;

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private java.sql.Date birthDate;                 // 생년월일
        private String phoneNumber;            // 전화번호


        private Long dongId;                // 동 id
        private String hoName;              // 호 이름
        
        public Member toEntity(){
            Member member=Member.builder()
                    .nickname(nickname)
                    .username(username)
                    .password(password)
                    .birthDate(birthDate)
                    .phoneNumber(phoneNumber)
                    .isCertified(false)
                    .score(50)              // 기본값 50
                    .build();

            return member;
        }
    }

    // 회원 정보와 회원이 등록한 집 정보를 담은 class
    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class Response {
        private Long id;
        private String nickname;
        private String username;
        private String password;
        private Date birthDate;
        private String phoneNumber;
        private int score;
        private String profileImg;
        private int penaltyCount;
        private boolean isCertified;
        private String inviteCode;
        private String fcmToken;
        private Boolean isNotiDongAll;
        private Boolean isNotiCategoryAll;
        private Timestamp pauseStartAt;
        private Timestamp pauseEndAt;
        private List<String> roles = new ArrayList<>();

        private Long aptId;
        private String aptName;
        private Long dongId;
        private String dongName;
        private Long hoId;
        private String hoName;
        private String officeTelNumber;

        private String certificationImg;
        private Time notificationStart;
        private Time notificationEnd;
        private List<ChatRoom> chatRooms;
        private List<NotiDong> notiDongs;
        private List<NotiDealCategory> notiDealCategories;
        private List<MembersNotification> membersNotifications;

        public static Response of(Member member, Ho ho) {
            return Response.builder()
                    .id(member.getId())
                    .username(member.getUsername())
                    .password(null)
                    .nickname(member.getNickname())
                    .birthDate(member.getBirthDate())
                    .phoneNumber(member.getPhoneNumber())
                    .score(member.getScore())
                    .isCertified(member.isCertified())
                    .aptId(ho.getDong().getApartment().getId())
                    .aptName(ho.getDong().getApartment().getName())
                    .dongId(ho.getDong().getId())
                    .dongName(ho.getDong().getName())
                    .hoId(ho.getId())
                    .hoName(ho.getName())
                    .officeTelNumber(ho.getDong().getApartment().getOfficeTelNumber())
                    .inviteCode(ho.getInviteCode())
                    .roles(member.getRoles())
                    .pauseStartAt(member.getPauseStartAt())
                    .pauseEndAt(member.getPauseEndAt())
                    .build();
        }

        public static Response of(Member member) {
            System.out.println("===========RESPONSE==============");
            System.out.println(member);
            System.out.println(member.isNotiDongAll());

            return Response.builder()
                    .id(member.getId())
                    .nickname(member.getNickname())
                    .password(null)
                    .username(member.getUsername())
                    .birthDate(member.getBirthDate())
                    .phoneNumber(member.getPhoneNumber())
                    .score(member.getScore())
                    .isCertified(member.isCertified())
                    .notificationStart(member.getNotificationStart())
                    .notificationEnd(member.getNotificationEnd())
                    .notiDealCategories(member.getNotiDealCategories())
                    .notiDongs(member.getNotiDongs())
                    .isNotiDongAll(member.isNotiDongAll())
                    .isNotiCategoryAll(member.isNotiCategoryAll())
                    .roles(member.getRoles())
                    .pauseStartAt(member.getPauseStartAt())
                    .pauseEndAt(member.getPauseEndAt())
                    .build();
        }


        public Member toEntity() {
            return Member.builder()
                    .id(id)
                    .nickname(nickname)
                    .username(username)
                    .password(password)
                    .birthDate(birthDate)
                    .phoneNumber(phoneNumber)
                    .score(score)
                    .fcmToken(fcmToken)
                    .roles(roles)
                    .isCertified(isCertified)
                    .notificationStart(notificationStart)
                    .notificationEnd(notificationEnd)
                    .notiDealCategories(notiDealCategories)
                    .notiDongs(notiDongs)
                    .roles(roles)
                    .build();
        }
    }


    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class ResponseWithDeal{
        private Long id;
        private String nickname;
        private String username;
        private int score;

        private ApartmentDto.Response apt;
        private Long dongId;
        private String dongName;

        public static ResponseWithDeal of(Member member, Ho ho){
            return ResponseWithDeal.builder()
                    .id(member.getId())
                    .username(member.getUsername())
                    .nickname(member.getNickname())
                    .score(member.getScore())
                    .apt(ApartmentDto.Response.of(ho.getDong().getApartment()))
                    .dongId(ho.getDong().getId())
                    .dongName(ho.getDong().getName())
                    .build();
        }
    }



    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class SignUp{
        private String nickname;                    // 이름
        private String username;                // 사용자 이메일
        private String password;                // 비밀번호

        @DateTimeFormat(pattern = "yyyy-MM-dd")
        private Date birthDate;                 // 생년월일

        private String phoneNumber;            // 전화번호
        private List<String> roles=new ArrayList<>();

        public Member toEntity(MemberDto.Request req,List<String> roles,boolean isCertified){
            Member member=Member.builder()
                    .nickname(req.getNickname())
                    .username(req.getUsername())
                    .password(req.getPassword())
                    .birthDate(req.getBirthDate())
                    .phoneNumber(req.getPhoneNumber())
                    .isCertified(isCertified)
                    .score(50)              // 기본값 50
                    .roles(roles)
                    .build();

            return member;
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TotalInfo{
        private Long id;
        private String nickname;
        private String username;
        private String password;
        private Date birthDate;
        private String phoneNumber;
        private int score;
        private String profileImg;
        private int penaltyCount;
        private boolean isCertified;
        private String fcmToken;
        private String inviteCode;
        private Boolean isNotiDongAll;
        private Boolean isNotiCategoryAll;
        private List<String> roles = new ArrayList<>();
        private Long aptId;
        private String aptName;
        private Long dongId;
        private String dongName;
        private Long hoId;
        private String hoName;
        private String officeTelNumber;

        private Timestamp createdAt;
        private Timestamp updatedAt;
        private Timestamp deletedAt;
        private String certificationImg;
        private Time notificationStart;
        private Time notificationEnd;
        private List<ChatRoom> chatRooms;
        private List<NotiDong> notiDongs;
        private List<NotiDealCategory> notiDealCategories;
        private List<MembersNotification> membersNotifications;



        public TotalInfo toTotalInfo(Response response,DongDto.Response dong,HoDto ho) {
            TotalInfo totalInfo=TotalInfo.builder()
                    .id(response.getId())
                    .nickname(response.getNickname())
                    .username(response.getUsername())
                    .birthDate(response.getBirthDate())
                    .phoneNumber(response.getPhoneNumber())
                    .score(response.getScore())
                    .profileImg(response.getProfileImg())
                    .penaltyCount(response.getPenaltyCount())
                    .isCertified(response.isCertified())
                    .fcmToken(response.getFcmToken())
                    .chatRooms(response.getChatRooms())
                    .notiDongs(response.getNotiDongs())
                    .notiDealCategories(response.getNotiDealCategories())
                    .isNotiCategoryAll(response.getIsNotiCategoryAll())
                    .isNotiDongAll(response.getIsNotiDongAll())
                    .membersNotifications(response.getMembersNotifications())
                    .hoId(ho.getId())
                    .hoName(ho.getName())
                    .dongId(dong.getDongId())
                    .dongName(dong.getName())
                    .aptId(dong.getApartment().getId())
                    .aptName(dong.getApartment().getName())
                    .officeTelNumber(dong.getApartment().getOfficeTelNumber())
                    .inviteCode(ho.getInviteCode())
                    .roles(response.getRoles())
                    .build();
            return totalInfo;
        }

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder(toBuilder = true)
    public static class Modification{
        private Long id;
        private String nickname;
        private String username;
        private String password;
        private Date birthDate;
        private String phoneNumber;
    }

}