import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConversationService } from 'src/app/services/conversation.service';
import { MessageService } from 'src/app/services/message.service';
import { Message } from 'src/app/core/models/message.model';
import { Conversation } from 'src/app/core/models/conversation.model';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  conversationId!: number;
  messages: Message[] = [];
  newMessage: string = '';
  conversation?: Conversation;
  isLoading = false;
  errorMessage = '';

  readonly ADMIN_ID = 1;
  readonly USER_ID = 2;
  currentUserId = this.USER_ID; // Default to admin

  constructor(
    private route: ActivatedRoute,
    private conversationService: ConversationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.conversationId = +id;
      this.loadConversation(this.conversationId);
    }

    // Adjust logic here to dynamically detect admin/user if needed
    const isAdmin = true;
    this.currentUserId = isAdmin ? this.ADMIN_ID : this.USER_ID;
  }

  loadConversation(id: number): void {
    this.isLoading = true;
    this.conversationService.getConversationById(id).subscribe({
      next: (conversation: Conversation) => {
        this.conversation = conversation;
        this.messages = conversation?.messages || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load conversation.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  isActiveConversation(): boolean {
    return this.conversation?.active === true && this.conversation?.closed === false;
  }

 sendMessage(): void {
  if (!this.newMessage.trim()) return;

  if (this.conversation?.closed) {
    this.errorMessage = 'This conversation is closed. You can no longer send messages.';
    return;
  }

  this.messageService.sendMessage({
    conversationId: this.conversationId,
    senderId: this.currentUserId,
    content: this.newMessage.trim()
  }).subscribe({
    next: (msg: Message) => {
      this.messages.push(msg);
      this.newMessage = '';
    },
    error: (err) => {
      console.error('❌ Failed to send message:', err);
      this.errorMessage = 'Failed to send message. Please try again.';
    }
  });
}

}
