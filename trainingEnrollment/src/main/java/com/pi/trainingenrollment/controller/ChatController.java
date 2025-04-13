package com.pi.trainingenrollment.controller;

import com.pi.trainingenrollment.dtos.ChatMessage;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/chat/{programId}")
    @SendTo("/topic/messages/{programId}")
    public ChatMessage send(@DestinationVariable String programId, ChatMessage message) {
        return message;
    }
}
