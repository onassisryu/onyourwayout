package com.ssafy.oywo.dto;

import com.ssafy.oywo.entity.MembersNotification;
import com.ssafy.oywo.entity.Notification;
import lombok.Builder;
import lombok.Getter;

public class MembersNotificationDto {

    @Getter
    public static class Response{
        Long id;

        Notification notification;

        boolean isRead;

        @Builder
        public Response(Long id, Notification notification, boolean isRead) {
            this.id = id;
            this.notification = notification;
            this.isRead = isRead;
        }

        public static Response of(MembersNotification membersNotification){
            return Response.builder().
                    id(membersNotification.getId()).
                    notification(membersNotification.getNotification()).
                    isRead(membersNotification.isRead()).
                    build();
        }

    }
}
