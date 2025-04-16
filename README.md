# 🌐 Hackathon & Forum Frontend (Angular 16+)

Ce projet représente la partie **frontend Angular** du module de gestion des hackathons et forums, développé dans le cadre d’un projet collaboratif DevDynamous. Il communique avec des microservices **Spring Boot** via une **API Gateway** centralisée.

---

## 📌 Objectifs du frontend

L’application Angular permet aux utilisateurs de :

- 🔍 **Consulter les hackathons disponibles**
- 🧑‍💻 **Participer ou se désinscrire d’un hackathon**
- 🏆 **Voir les meilleurs posts liés à chaque hackathon**
- 📊 **Afficher des statistiques dynamiques sur la participation**
- 📬 **Interagir avec un forum tech intégré**

---

## 🔗 Communication entre services

Le frontend Angular interagit avec l’API Gateway (`Spring Cloud Gateway`) exposant les microservices suivants :

- `hackathon-service`
- `post-service` (forum)
- `user-service`
- `auth-service`

Toutes les requêtes HTTP transitent via `http://localhost:8222/api/...`.

---

## 🧩 Fonctionnalités principales

### Hackathons
- Liste des hackathons (`/hackathons`)
- Détails et statistiques d’un hackathon
- Inscription à un hackathon
- Affichage des participants et des meilleurs posts

### Forum
- Consultation des publications
- Interaction avec les commentaires
- Statistiques de posts par utilisateur

### Authentification
- Connexion sécurisée via `auth-service`
- Affichage conditionnel des fonctionnalités selon le rôle (admin, user...)

---

## ⚙️ Technologies utilisées

- ✅ **Angular 16+**
- ✅ **TypeScript / HTML / SCSS**
- ✅ **Bootstrap / Tailwind / Custom CSS**
- ✅ **RxJS / HTTPClientModule**
- ✅ **Chart.js / ApexCharts (pour les stats)**
- ✅ **Eureka + Gateway côté backend**
- ✅ **Connexion aux microservices via Gateway**

---

## 🖼️ Structure du projet

