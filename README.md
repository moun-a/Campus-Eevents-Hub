# 📚 Campus Events Hub

Plateforme web pour la gestion et la participation aux événements d’un campus universitaire.  
Développée dans le cadre d’un projet tutoré.

---

## 👥 Membres du projet

- **Mouna Mouhib** – Étudiante en systèmes embarqués et services numériques  
- **Abdessamad Titi** – Étudiant en systèmes embarqués et services numériques  
- **Encadrant :** M. **Tarik Fisaa**

---

## 🔧 Structure du projet

<pre lang="markdown"> ```bash Campus-Eevents-Hub/ ├── backend/ │ ├── app.js │ ├── routes/ │ ├── controllers/ │ ├── models/ │ └── config/ ├── frontend/ │ ├── index.html │ ├── pages/ │ ├── css/ │ └── js/ ├── database/ │ └── schema.sql └── README.md ``` </pre>


## 🧰 Technologies utilisées

### 🔙 Backend

- **Node.js** avec **Express.js**
- **MySQL** via le module `mysql2`
- **JWT** (JSON Web Tokens) pour l’authentification
- **Bcrypt** pour le hachage des mots de passe
- **Dotenv** pour les variables d’environnement
- **Nodemon** pour le développement

### 🌐 Frontend

- **HTML5** (structure)
- **CSS3** (styles)
- **JavaScript (ES6+)** avec modules
- **Font Awesome 6.0.0** (icônes)
- **AOS 2.3.1** – Animate On Scroll (animations)
- Aucun framework JS (pas de React/Vue/Angular)

---

## 🗃️ Structure de la base de données

Le projet repose sur les tables suivantes :

- `users` – Stocke les utilisateurs
- `events` – Informations des événements
- `categories` – Catégories des événements
- `attendees` – Inscriptions aux événements
- `comments` – Commentaires sur les événements

*(Un diagramme relationnel est disponible dans le rapport.)*

---

## ✨ Fonctionnalités principales

- Inscription et connexion sécurisées
- Création, modification et suppression d’événements
- Filtrage des événements par catégorie
- Inscription / désinscription à un événement
- Consultation de la liste des participants
- Ajout de commentaires sur un événement

---

## 🚀 Démarrage local

### 1. Cloner le dépôt

```bash
git clone https://github.com/moun-a/Campus-Eevents-Hub.git
cd Campus-Eevents-Hub

##Lancer le serveur backend

cd backend
npm install
npm run dev
