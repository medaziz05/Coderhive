package com.ticket.services;

import com.ticket.entities.Conversation;
import com.ticket.entities.Message;
import com.ticket.repositories.ConversationRepository;
import com.ticket.repositories.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    public Message sendMessage(Long conversationId, Long senderId, String content) {
        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = new Message();
        message.setContent(content);
        message.setSenderId(senderId);
        message.setConversation(conversation);

        return messageRepository.save(message);
    }
}