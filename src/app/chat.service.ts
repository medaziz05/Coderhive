import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor() {}

  // Méthode pour envoyer un message à un chatbot statique avec des informations de formations
  sendMessage(message: string): Observable<any> {
    const staticResponses = {
      "bonjour": "Salut ! Comment puis-je vous aider ?",
      "comment ça va?": "Je vais bien, merci ! Et toi ?",
      
      // Réponse sur la formation Advanced Big Data
      "formation advanced big data": `La formation "Advanced Big Data" couvre les sujets suivants :
        - Introduction à Big Data
        - Traitement des données avec Hadoop et Spark
        - Analyse des données avec MapReduce
        - Gestion des systèmes distribués
        - Utilisation de Hive et HBase

        Prix : 1000 EUR
        Durée : 3 mois
        Format : Cours en ligne + Ateliers pratiques

        Pour plus de détails, veuillez consulter notre site web ou nous contacter.`,
      
      // Réponse sur le prix de la formation
      "prix advanced big data": "Le prix de la formation 'Advanced Big Data' est de 1000 EUR.",
      
      // Réponse sur la durée de la formation
      "durée advanced big data": "La formation 'Advanced Big Data' dure 3 mois.",
      
      // Réponse sur le format de la formation
      "format advanced big data": "La formation est dispensée en ligne avec des ateliers pratiques.",
      
      // Nouvelle question : Quelles formations offrez-vous ?
      "quelles formations offrez-vous": `
        Voici quelques formations que nous offrons :
        - Advanced Big Data
        - Data Science avec Python
        - Machine Learning
        - Cloud Computing
        - Développement Web Full Stack

        Pour plus d'informations sur chaque formation, n'hésitez pas à demander !`,
      
      // Ajouter d'autres questions courantes
      "formation python": "La formation Python couvre des bases à avancées, y compris l'utilisation de bibliothèques comme Pandas, NumPy et Matplotlib.",
      "formation machine learning": "La formation Machine Learning inclut l'apprentissage supervisé, non supervisé et le deep learning.",
      "formation data science": "La formation Data Science couvre la manipulation des données, les statistiques, et l'analyse avec des outils comme Python et R.",
      "formation cloud computing": "La formation Cloud Computing vous apprendra à utiliser des plateformes comme AWS et Azure pour déployer des applications scalables.",
    };

    return new Observable((observer) => {
      // Retourner la réponse statique ou un message par défaut
      const response = staticResponses[message.toLowerCase()] || "Désolé, je n'ai pas compris.";
      observer.next(response);
      observer.complete();
    });
  }
}
