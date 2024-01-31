package com.ssafy.oywo.repository;

import com.ssafy.oywo.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage,Long> {
}
