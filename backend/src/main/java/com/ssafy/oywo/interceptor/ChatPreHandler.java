package com.ssafy.oywo.interceptor;

import com.ssafy.oywo.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@RequiredArgsConstructor
@Component
@Slf4j
public class ChatPreHandler implements ChannelInterceptor {


    @EventListener
    public void handleWebSocketConnectionListener(SessionConnectedEvent event){
        log.info("사용자 입장");
    }

    @EventListener
    public void handleWebSocketDisconnectionListener(SessionDisconnectEvent event){
        log.info("사용자 퇴장");
    }
}
