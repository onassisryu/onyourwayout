package com.ssafy.oywo.config;

import com.ssafy.oywo.interceptor.ChatPreHandler;
import com.ssafy.oywo.interceptor.HttpHandshakeInterceptor;
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
        // web socket 통신 url : ws://~~/ws/chat
        registry.addEndpoint("/ws/chat").setAllowedOriginPatterns("*")
                .addInterceptors(new HttpHandshakeInterceptor());
    }

    // 보낼 때와 받을 때 prefix 지정
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // enableSimpleBroker 스프링에서 제공하는 내장 브로커를 사용한다는 설정
        // "/sub" 경로가 붙은 경우 messageBroker가 잡아서 해당 채팅방에 구독하고 있는 클라이언트에게 메시지 전달
        registry.enableSimpleBroker("/sub");
        
        // 클라이언트가 메시지를 발행할 때, 브로커의 목적지에 접두사를 정의하는 것
        // 클라이언트가 메시지를 보낼 때 경로 맨 앞에 "/pub" 붙어있으면 Broker로 보내짐
        registry.setApplicationDestinationPrefixes("/pub");
    }

    // 인증된 사용자만 받기 위해 chatPreHandler 등록
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(chatPreHandler);
    }
}
