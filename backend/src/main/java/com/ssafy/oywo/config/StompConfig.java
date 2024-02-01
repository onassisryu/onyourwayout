package com.ssafy.oywo.config;

import com.ssafy.oywo.interceptor.ChatPreHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompSessionHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class StompConfig implements WebSocketMessageBrokerConfigurer {

    private final ChatPreHandler chatPreHandler;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/chat").setAllowedOriginPatterns("*").withSockJS();
    }

    // 보낼 때와 받을 때 prefix 지정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // enableSimpleBroker 스프링에서 제공하는 내장 브로커를 사용한다는 설정
        // "/room" 경로가 붙은 경우 messageBroker가 잡아서 해당 채팅방에 구독하고 있는 클라이언트에게 메시지 전달
        registry.enableSimpleBroker("/room");
        
        // 클라이언트가 메시지를 보낼 때 경로 맨 앞에 "/send" 붙어있으면 Broker로 보내짐
        registry.setApplicationDestinationPrefixes("/send");
    }

    // 인증된 사용자만 받기 위해 chatPreHandler 등록
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(chatPreHandler);
    }
}
