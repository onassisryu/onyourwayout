package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import lombok.*;

import java.math.BigDecimal;
import java.util.prefs.AbstractPreferences;


public class ApartmentDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private Long aptId;
        private String name;

        public Apartment toEntity(){
            Apartment apt = Apartment.builder()
                    .id(aptId)
                    .name(name)
                    .build();
            return apt;
        }
    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class Response{
        private Long id;
        private String name;

        public static Response of(Apartment apartment) {
            return Response.builder()
                    .id(apartment.getId())
                    .name(apartment.getName())
                    .build();
        }


    }

    @Getter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder(toBuilder = true)
    public static class LoginResponse{
        private Long id;
        private String name;
        private BigDecimal aptLat;
        private BigDecimal aptLng;
        private String officeTelNumber;

        public static LoginResponse of(Apartment apartment) {
            return LoginResponse.builder()
                    .id(apartment.getId())
                    .name(apartment.getName())
                    .aptLat(apartment.getLat())
                    .aptLng(apartment.getLng())
                    .officeTelNumber(apartment.getOfficeTelNumber())
                    .build();
        }


    }
}