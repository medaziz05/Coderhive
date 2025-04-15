import { Component, OnInit } from '@angular/core';
import { TicketService } from 'src/app/services/ticket.service';
import { MessageService } from 'src/app/services/message.service';
import { ConversationService } from 'src/app/services/conversation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Ticket } from '../../core/models/ticket.model';
import { Conversation } from 'src/app/core/models/conversation.model';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;
  replyMessage = '';
  statusOptions: Ticket['status'][] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];
  searchTerm: string = '';
  sortKey: 'title' | 'createdAt' | 'status' = 'createdAt';
  sortDirection: 'asc' | 'desc' = 'desc';
  isDarkMode = false;
  
  constructor(
    private ticketService: TicketService,
    private messageService: MessageService,
    private conversationService: ConversationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchTickets();
  }

  fetchTickets() {
    this.ticketService.getAllTickets().subscribe((data: Ticket[]) => {
      this.tickets = data;
    });
  }

  selectTicket(ticket: Ticket) {
    this.selectedTicket = ticket;
    this.replyMessage = '';
  }

  sendReply() {
    if (!this.selectedTicket || !this.replyMessage.trim()) return;

    const ticketId = this.selectedTicket.id!;
    const conversation = this.selectedTicket.conversation;

    if (this.selectedTicket.status === 'RESOLVED') {
      this.snackBar.open('❌ Cannot reply to a resolved ticket.', 'Close', { duration: 3000 });
      return;
    }

    if (!conversation) {
      // ✅ Start conversation then send message
      this.conversationService.createConversation(ticketId).subscribe({
        next: (conv: Conversation) => {
          this.selectedTicket!.conversation = conv;
          this.sendMessage(conv.id!);
        },
        error: () => {
          this.snackBar.open('❌ Failed to start conversation.', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.sendMessage(conversation.id!);
    }
  }

  sendMessage(conversationId: number) {
    this.messageService.sendMessage({
      conversationId,
      senderId: 0, // admin
      content: this.replyMessage.trim()
    }).subscribe({
      next: () => {
        this.snackBar.open('✅ Reply sent!', 'Close', { duration: 3000 });
        this.replyMessage = '';
        this.fetchTickets(); // recharge les tickets pour voir le message
      },
      error: () => {
        this.snackBar.open('❌ Failed to send message.', 'Close', { duration: 3000 });
      }
    });
  }

  updateStatus(status: Ticket['status']) {
    if (!this.selectedTicket) return;

    this.ticketService.updateStatus(this.selectedTicket.id!, status).subscribe(() => {
      this.snackBar.open('📌 Status updated!', 'Close', { duration: 3000 });
      this.fetchTickets();
    });
  }

  // New method to export conversation as PDF
 // New method to export conversation as PDF
// New method to export conversation as PDF
// New method to export conversation as PDF
exportPDF() {
  if (!this.selectedTicket) {
    this.snackBar.open('❌ No ticket selected.', 'Close', { duration: 3000 });
    return;
  }

  const ticket = this.selectedTicket;
  
  // Check if ticket is RESOLVED
  if (ticket.status !== 'RESOLVED') {
    this.snackBar.open('❌ Only RESOLVED tickets can be exported to PDF.', 'Close', { duration: 3000 });
    return;
  }
  
  const conversation = ticket.conversation;
  
  if (!conversation || !conversation.messages || conversation.messages.length === 0) {
    this.snackBar.open('❌ No conversation messages to export.', 'Close', { duration: 3000 });
    return;
  }

  // Rest of your PDF generation code remains the same...
  const doc = new jsPDF();
  
  // (existing code continues...)

  
  // Set document title and properties
  doc.setFontSize(20);
  doc.text('Support Ticket Conversation', 105, 15, { align: 'center' });
  
  // Add ticket information
  doc.setFontSize(12);
  doc.text(`Ticket #${ticket.id || 'N/A'} - ${ticket.title}`, 14, 30);
  doc.text(`Status: ${ticket.status}`, 14, 40);
  
  // Format date with proper options - handle potential undefined
  const dateOptions: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  // Ensure we have a valid date before formatting
  const createdDate = ticket.createdAt ? new Date(ticket.createdAt) : new Date();
  doc.text(`Created: ${createdDate.toLocaleString('en-US', dateOptions)}`, 14, 50);
  
  // Add description section
  doc.setFontSize(14);
  doc.text('Description:', 14, 65);
  doc.setFontSize(12);
  
  // Handle long descriptions with word wrap
  const splitDescription = doc.splitTextToSize(ticket.description || 'No description available', 180);
  doc.text(splitDescription, 14, 75);
  
  // Calculate starting y position after the description
  let yPos = 80 + (splitDescription.length * 7);
  
  // Add conversation section
  doc.setFontSize(14);
  doc.text('Conversation History:', 14, yPos);
  yPos += 10;
  
  // Prepare table data for conversation
  const tableColumn = ["Sender", "Message", "Date"];
  const tableRows = conversation.messages.map(msg => {
    // Handle potentially undefined date
    const msgDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
    return [
      msg.senderId === 0 ? 'Admin' : 'User',
      msg.content || '',
      msgDate.toLocaleString('en-US', dateOptions)
    ];
  });
  
  // Add conversation as a table
  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: yPos,
    headStyles: { fillColor: [75, 75, 75] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 110 },
      2: { cellWidth: 50 }
    },
    styles: {
      overflow: 'linebreak',
      cellPadding: 3,
    },
    didDrawPage: (data) => {
      // Add footer
      const currentDate = new Date();
      doc.setFontSize(10);
      doc.text(`Generated on ${currentDate.toLocaleString('en-US', dateOptions)}`, 14, doc.internal.pageSize.height - 10);
      // Fix for getCurrentPageInfo issue - use a different approach
      const pageNumber = (doc as any).internal.getNumberOfPages();
      doc.text(`Page ${pageNumber}`, doc.internal.pageSize.width - 25, doc.internal.pageSize.height - 10);
    }
  });
  
  // Save the PDF with the ticket ID and title
  const safeTicketId = ticket.id || 'unknown';
  doc.save(`ticket-${safeTicketId}-conversation.pdf`);
  
  this.snackBar.open('✅ PDF generated successfully!', 'Close', { duration: 3000 });
}

  get isConversationClosedFlag(): boolean {
    return this.selectedTicket?.conversation?.closed || false;
  }
  
  get filteredTickets(): Ticket[] {
    let filtered = this.tickets;

    // 🔍 Filtrage par mot-clé
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(term) ||
        ticket.description.toLowerCase().includes(term)
      );
    }

    // ⬆️⬇️ Tri
    return filtered.sort((a, b) => {
      const aValue = a[this.sortKey];
      const bValue = b[this.sortKey];
      
      if (aValue! < bValue!) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue! > bValue!) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  toggleSort(key: 'title' | 'createdAt' | 'status') {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
  }
}