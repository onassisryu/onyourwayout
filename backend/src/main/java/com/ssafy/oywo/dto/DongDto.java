package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Apart;
import com.ssafy.oywo.entity.Dong;
import lombok.*;


public class DongDto {

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Request{
        private Long dongId;
        private String name;
        private Apart apart;
        public Dong toEntity(){
            Dong dong=Dong.builder()
                    .id(dongId)
                    .apart(apart)
                    .name(name)
                    .build();
            return dong;
        }
    }
    @Getter
    public static class Response{
        private Long dongId;
        private String name;
        private Apart apart;

        public Response(Dong dong){
            this.dongId=dong.getId();
            this.apart=dong.getApart();
            this.name=dong.getName();
        }
    }
}
