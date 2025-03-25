import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-presence-scanner',
  templateUrl: './presence-scanner.component.html'
})
export class PresenceScannerComponent {
  message = '';
  qrFormat = [BarcodeFormat.QR_CODE];

  constructor(private http: HttpClient) {}

  onScanSuccess(result: string): void {
    const [participantId, sessionId] = result.split(':');

    if (participantId && sessionId) {
      this.http.post('/api/v1/enrollment/presence', {
        participantId: Number(participantId),
        sessionId: Number(sessionId)
      }).subscribe({
        next: () => this.message = '✅ Présence enregistrée !',
        error: () => this.message = '❌ Erreur lors de l’enregistrement.'
      });
    } else {
      this.message = 'QR Code invalide';
    }
  }
}
