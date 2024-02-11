package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import lombok.*;

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
}