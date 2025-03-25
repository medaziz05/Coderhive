import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private staticResponses = {
    "bonjour": "Salut, comment puis-je vous aider ?",
    "quelles formations proposez-vous ?": "Nous proposons plusieurs formations, telles que le développement web, Advanced Big Data, Digital Marketing, et Cybersecurity.",
    "combien coûte une formation ?": "Le prix des formations varie en fonction du programme. En moyenne, il varie entre 300€ et 1500€.",
    "quelle est la durée des formations ?": "Les formations peuvent durer entre 2 semaines et 6 mois, selon le programme choisi.",
    "qui es-tu ?": "Je suis un chatbot créé pour répondre à vos questions sur nos formations.",
    "au revoir": "À bientôt !",
    "comment m'inscrire à une formation ?": "Pour vous inscrire à une formation, vous pouvez visiter notre site web et suivre les instructions sur la page d'inscription.",
    "y a-t-il des prérequis pour les formations ?": "Certaines formations peuvent avoir des prérequis, comme des connaissances de base en informatique ou en mathématiques pour les formations en Big Data ou en développement web.",
    "quelles sont les modalités de paiement ?": "Nous acceptons différents modes de paiement, y compris les cartes bancaires, PayPal et les virements bancaires.",
    "offrez-vous des certifications ?": "Oui, nous offrons des certificats à la fin de chaque formation, valables dans le secteur professionnel.",
    "comment puis-je contacter le support ?": "Vous pouvez contacter notre équipe de support par email à support@formations.com ou via notre formulaire de contact sur le site web.",
    "quels sont les horaires des formations ?": "Les horaires varient selon la formation. Certaines formations sont proposées en ligne et d'autres en présentiel. Vous pouvez vérifier les horaires spécifiques sur notre site.",
    "quelles sont les dates des prochaines sessions ?": "Les dates des prochaines sessions sont disponibles sur notre site. Vous pouvez consulter le calendrier des formations pour plus de détails.",
    "je ne trouve pas ce que je cherche, pouvez-vous m'aider ?": "Je suis désolé, je ne suis pas sûr de pouvoir répondre à cette question. Vous pouvez contacter notre support pour des informations plus détaillées.",
    "comment puis-je annuler mon inscription ?": "Pour annuler votre inscription, veuillez nous contacter par email ou appeler notre service client au numéro indiqué sur le site.",
    "offrez-vous des réductions ou des promotions ?": "Oui, nous proposons parfois des réductions ou des promotions spéciales. Abonnez-vous à notre newsletter pour recevoir des informations sur nos offres.",
    "que comprend le programme de formation en développement web ?": "Le programme de formation en développement web couvre des sujets comme HTML, CSS, JavaScript, React, Node.js et les bases de données.",
    "comment savoir si une formation est faite pour moi ?": "Si vous êtes intéressé par une formation, vous pouvez lire la description complète du programme sur notre site et consulter les prérequis pour déterminer si la formation est adaptée à votre niveau.",
    "quel est le programme de la formation en Big Data ?": "Le programme en Big Data comprend des sujets comme Hadoop, Spark, NoSQL, et l'analyse de données massives, ainsi que des applications réelles.",
    "les formations sont-elles en ligne ?": "Oui, nous proposons des formations en ligne ainsi qu'en présentiel pour certaines spécialisations. Vous pouvez choisir celle qui vous convient le mieux.",
    "comment accéder aux cours en ligne ?": "Une fois inscrit à une formation en ligne, vous recevrez un accès à notre plateforme d'apprentissage où vous pourrez suivre les cours.",
    "quels outils sont utilisés dans la formation en Data Science ?": "La formation en Data Science couvre des outils comme Python, R, TensorFlow, Pandas, et scikit-learn.",
    "ai-je un accès à la formation après la fin du programme ?": "Oui, vous garderez l'accès à la plateforme d'apprentissage même après la fin de votre formation, afin de réviser les cours à votre rythme.",
    "est-ce que je peux suivre plusieurs formations en même temps ?": "Oui, vous pouvez vous inscrire à plusieurs formations en fonction de votre emploi du temps et de votre charge de travail.",
    "quel est le taux de réussite des formations ?": "Le taux de réussite varie selon la formation, mais en moyenne, 85% de nos étudiants terminent leur formation avec succès.",
    "quel est le contenu de la formation en Digital Marketing ?": "La formation en Digital Marketing couvre des sujets comme le SEO, la publicité sur les réseaux sociaux, l'email marketing, et l'analyse de données pour le marketing digital.",
    "puis-je obtenir une bourse ?": "Nous proposons quelques bourses pour les étudiants qualifiés. Veuillez vérifier sur notre site pour plus d'informations sur les conditions d'obtention des bourses.",
    "qui sont les formateurs ?": "Nos formateurs sont des experts dans leur domaine, avec plusieurs années d'expérience professionnelle dans l'industrie.",
    "comment puis-je avoir plus d'informations sur les formations ?": "Vous pouvez obtenir plus d'informations sur nos formations en consultant notre site web ou en contactant notre équipe de support.",
    "default": "Désolé, je n'ai pas compris votre question. Pouvez-vous reformuler ?"
  };

  constructor() {}

  getResponse(message: string): string {
    message = message.toLowerCase().trim();
    return this.staticResponses[message] || this.staticResponses["default"];
  }
}
