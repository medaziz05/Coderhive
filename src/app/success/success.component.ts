import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Si tu veux récupérer des paramètres de l'URL (comme un ID de paiement)

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  message: string = 'Votre paiement a été effectué avec succès.';
  paymentId: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Optionnel : récupérer un paramètre de l'URL (par exemple, un ID de paiement)
    this.paymentId = this.route.snapshot.queryParamMap.get('paymentId');
    if (this.paymentId) {
      this.message = `Le paiement ${this.paymentId} a été effectué avec succès.`;
    }
  }
}
