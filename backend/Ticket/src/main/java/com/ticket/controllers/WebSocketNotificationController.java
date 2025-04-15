// WebSocketNotificationController.java
package com.ticket.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import jakarta.annotation.PostConstruct;

@Controller
public class WebSocketNotificationController {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/conversation/{conversationId}/join")
    public void handleUserJoin(
            @DestinationVariable Long conversationId) {
        // Can be used to track active users in conversation
        messagingTemplate.convertAndSend("/topic/conversation/" + conversationId + "/presence", "USER_JOINED");
    }
}