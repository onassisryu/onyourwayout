package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Apartment;
import com.ssafy.oywo.entity.Dong;
import lombok.*;

import java.math.BigDecimal;


public class DongDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private Long dongId;
        private String name;
        private Apartment apartment;
        public Dong toEntity(){
            Dong dong = Dong.builder()
                    .id(dongId)
                    .apartment(apartment)
                    .name(name)
                    .build();
            return dong;
        }
    }
    @Getter
    public static class Response{
        private Long dongId;
        private String name;
        private Apartment apartment;
        private BigDecimal lat;
        private BigDecimal lng;

        public Response(Long dongId, String name, Apartment apartment) {
            this.dongId = dongId;
            this.name = name;
            this.apartment = apartment;
        }


        public Response(Long dongId, String name, BigDecimal lat, BigDecimal lng) {
            this.dongId = dongId;
            this.name = name;
            this.lat = lat;
            this.lng = lng;
        }


    }
}