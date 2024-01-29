package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.Notification;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

public class NotificationDto {

    @Getter
    public static class Request{
        private Long id;

        private String title;

        private String message;

        private Notification.NotificationType notificationType;

        @Builder
        public Request(Long id, String title, String message, Notification.NotificationType notificationType) {
            this.id = id;
            this.title = title;
            this.message = message;
            this.notificationType = notificationType;
        }

    }
}
