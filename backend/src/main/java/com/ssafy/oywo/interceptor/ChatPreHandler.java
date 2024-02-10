package com.ssafy.oywo.interceptor;

import com.ssafy.oywo.jwt.JwtTokenProvider;
import com.ssafy.oywo.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.nio.file.AccessDeniedException;
import java.util.Objects;


@RequiredArgsConstructor
@Component
@Slf4j
@Order(Ordered.HIGHEST_PRECEDENCE+99)
public class ChatPreHandler implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    // websocket을 통해 들어온 요청이 처리되기 전에 실행됨
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel){
//        StompHeaderAccessor accessor=StompHeaderAccessor.wrap(message);
//        String authToken=accessor.getFirstNativeHeader("Authorization").substring(7);
//        // websocket 연결 시 헤더의 jwt token 유효성 검증
//        if (StompCommand.CONNECT==accessor.getCommand()){
//            jwtTokenProvider.validateToken(Objects.requireNonNull(authToken));
//        }
        return message;
    }
    @EventListener
    public void handleWebSocketConnectionListener(SessionConnectedEvent event){
        log.info("사용자 입장");
    }

    @EventListener
    public void handleWebSocketDisconnectionListener(SessionDisconnectEvent event){
        log.info("사용자 퇴장");
    }
}
