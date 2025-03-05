# 🎓 Code Factory - Plateforme de Gestion des Formations, Cours et Stages  

🚀 **Code Factory** est une plateforme éducative basée sur **l'architecture des microservices**, développée pour **l'apprentissage en informatique** et la gestion des **offres de stages**.  
Elle permet aux entreprises de publier des stages, aux étudiants de suivre des formations et d'interagir avec les formateurs à travers des cours, forums et hackathons.

---

## 📌 **Modules de l'application**
L'application est découpée en plusieurs **microservices**, chacun gérant une partie spécifique :

### **1️⃣ 👤 Gestion des Utilisateurs (Microservice "User Service")**
- **Authentification sécurisée** avec JWT
- **Rôles des utilisateurs** :
  - **Administrateur** : Gère la plateforme
  - **Formateur** : Crée et gère les cours
  - **Étudiant** : S'inscrit aux formations et postule aux stages
  - **Entreprise** : Publie et gère des offres de stage
- **Gestion des profils utilisateurs**
- **Notifications et emails automatisés**

---

### **2️⃣ 🎓 Gestion des Formations (Microservice "Training Service")**
- Création et gestion des **formations** par les formateurs
- Inscription des **étudiants aux formations**
- Attribution de **certifications**
- Suivi de **progression des étudiants**
- **Système d’évaluation** avec quiz et examens

---

### **3️⃣ 📚 Gestion des Cours (Microservice "Course Service")**
- Création et gestion des **cours individuels**
- Accès aux **vidéos, PDF, exercices**
- **Système de notation et commentaires**
- Association des cours aux formations

---

### **4️⃣ 📢 Gestion des Réclamations (Microservice "Complaint Service")**
- Dépôt de réclamations par les étudiants
- Suivi et traitement des réclamations par l’administration

---

### **5️⃣ 📝 Forum & Discussions (Microservice "Forum Service")**
- Création de posts et discussions
- Commentaires, likes et signalements

---

### **6️⃣ 🚀 Gestion des Hackathons (Microservice "Hackathon Service")**
- Organisation et inscription aux hackathons
- Dépôt de projets et notation

---

### **7️⃣ 📂 Gestion des Ressources Pédagogiques (Microservice "Resource Service")**
- Partage de **supports de cours** (PDF, vidéos, exercices)
- Téléchargement et accès aux fichiers pédagogiques

---

### **8️⃣ 🎓 Gestion des Offres de Stages (Microservice "Internship Service")**
- **L’Entreprise peut :**  
  ✅ Publier des offres de stage  
  ✅ Suivre les candidatures des étudiants  
  ✅ Sélectionner des profils et contacter les candidats  

- **L'Étudiant peut :**  
  ✅ Rechercher des offres et postuler  
  ✅ Envoyer son CV et suivre sa candidature  

---

## 🛠️ **Architecture des Microservices**
L’application suit l’**architecture microservices** avec **Spring Cloud** et **Eureka** :

📌 **Microservices indépendants** :
- `user-service` → Gestion des utilisateurs
- `training-service` → Gestion des formations
- `course-service` → Gestion des cours
- `complaint-service` → Réclamations
- `forum-service` → Forum
- `hackathon-service` → Hackathons
- `resource-service` → Ressources pédagogiques
- `internship-service` → Offres de stages

📌 **Outils utilisés** :
- **Spring Cloud Gateway** pour le **routage des requêtes**
- **Eureka Server** pour la **découverte des services**
- **Feign Client** pour la **communication entre services**
- **Resilience4J** pour la **tolérance aux pannes**
- **Docker & Kubernetes** pour le **déploiement**

---

## 🛠️ **Technologies utilisées**
### 🎨 **Frontend**
- Angular
- TypeScript
- Bootstrap / Material UI

### 🖥️ **Backend**
- **Spring Boot (Microservices)**
- **Spring Security (JWT)**
- Hibernate
- OpenAPI (Swagger)

### 🗄️ **Base de données**
- **MySQL / PostgreSQL**
- Cloud Storage pour les fichiers

---

## 📂 **Structure du projet**
