package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Notification;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class NotificationDto {

    @Schema(description = "test")
    @Getter
    public static class Request{
        private Long id;

        private String title;

        private String message;

        private Notification.NotificationType notificationType;

        @Builder
        public Request(String title, String message, Notification.NotificationType notificationType) {
            this.title = title;
            this.message = message;
            this.notificationType = notificationType;
        }

        public Notification toEntity(){
            return Notification.builder().
                    title(title).
                    message(message).
                    notificationType(notificationType).
                    build();

        }
    }

    @Getter
    @Builder
    public static class Response{
        @Schema(description = "알림 id")
        private Long id;
        @Schema(description = "알림 제목")
        private String title;
        @Schema(description = "알림 내용")
        private String message;
        @Schema(description = "알림 읽음 여부")
        private Boolean isRead;
        @Schema(description = "알림 타입")
        private Notification.NotificationType notificationType;

        private DealDto.Response deal;

        private DongDto.Response dong;

        public static Response of(Notification notification){
            return Response.builder().
                    id(notification.getId()).
                    title(notification.getTitle()).
                    message(notification.getMessage()).
                    notificationType(notification.getNotificationType()).
                    build();
        }

        public Notification toEntity(){
            return Notification.builder().
                    id(getId()).
                    title(getTitle()).
                    message(getMessage()).
                    notificationType(getNotificationType()).
                    build();
        }
    }
}
