import { Component, OnInit } from '@angular/core';
import { StripeElementsOptions, StripeCardElementOptions } from '@stripe/stripe-js';
import { PaymentService } from 'src/app/payment.service';
import { Router } from '@angular/router';  // Utilisation du Router pour la redirection

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  cardHolderName: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  stripeLoaded: boolean = false;

  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        '::placeholder': {
          color: '#aab7c4'
        }
      }
    }
  };

  elementsOptions: StripeElementsOptions = {
    locale: 'fr'
  };

  constructor(private paymentService: PaymentService, private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.stripeLoaded = true;
    }, 1000);
  }

  pay() {
    this.loading = true;
    this.errorMessage = '';
  
    this.paymentService.createCheckoutSession(1, 'eur').subscribe({
      next: (response: { url: string }) => {
        if (response && response.url) {
          window.location.href = response.url; // Redirection vers Stripe
          
;
        } else {
          this.loading = false;
          this.errorMessage = "Erreur : l'URL de paiement n'a pas été reçue.";
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = "Une erreur est survenue lors du paiement.";
      }
    });
  }
  
}
