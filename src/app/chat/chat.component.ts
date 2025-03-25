import { Component } from '@angular/core';
import { ChatbotService } from '../chatbot.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  userMessage: string = ''; // Message de l'utilisateur
  messages: { text: string; sender: string }[] = []; // Historique des messages

  constructor(private chatbotService: ChatbotService) {}

  sendMessage() {
    if (!this.userMessage.trim()) return; // Vérifier si le message est vide

    // Ajouter le message utilisateur à l'affichage
    this.messages.push({ text: this.userMessage, sender: 'user' });

    // Obtenir la réponse du chatbot
    const botResponse = this.chatbotService.getResponse(this.userMessage);
    this.messages.push({ text: botResponse, sender: 'bot' });

    // Réinitialiser le champ de saisie
    this.userMessage = '';
  }
}
