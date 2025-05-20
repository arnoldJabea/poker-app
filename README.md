
🃏 Poker App

Application web fullstack de simulation de poker (Texas Hold’em), développée en binôme avec Angular (frontend) et NestJS (backend), conteneurisée avec Docker et prête pour déploiement.

👥 Équipe projet

Rôle	Nom	Responsabilités principales
Frontend	Louis	Angular, UI/UX, intégration avec l’API
Backend	Arnold	NestJS, Docker, Tests, Git, CI/CD, README

📦 Stack technique

Côté	Technologies
Frontend	Angular 17, Angular Material, Dicebear Avatars
Backend	NestJS, TypeORM, PostgreSQL, JWT Auth
Design	Cartes SVG : https://github.com/hayeah/playing-cards-assets
DevOps	Docker, Docker Compose
Tests	Jest,

🚀 Lancer le projet en local

Cloner le dépôt

git clone https://github.com/ton-utilisateur/poker-app.git
cd poker-app

Lancer les conteneurs

docker compose up --build

	•	Frontend : http://localhost:4200
	•	Backend : http://localhost:3000

Seeder la base de données (optionnel)

docker compose exec backend-dev npm run seed

🧑‍💻 Fonctionnalités

Authentification
	•	Inscription et connexion
	•	Authentification JWT
	•	Avatar dynamique via Dicebear

Tableau de bord joueur
	•	Affichage du nom, argent, avatar
	•	Bouton “Motherlode 💰” pour ajouter de l’argent
	•	Affichage de cartes SVG aléatoires

🧪 Lancer les tests

Unitaires

docker compose exec backend-dev npm run test

docker compose exec backend-dev npm run test:e2e

🐳 Commandes Docker utiles

docker compose build
docker compose up
docker compose down
docker system prune -a --volumes

📁 Arborescence

poker-app/
├── backend/
│   └── src/
│       ├── auth/
│       ├── players/
│       ├── tables/
├── frontend/
│   └── src/
│       ├── app/
│           ├── components/
│           ├── services/
├── docker-compose.yml
├── README.md



✅ Checklist de rendu
	•	Authentification fonctionnelle
	•	Avatars Dicebear affichés
	•	Cartes SVG dynamiques affichées
	•	Docker fonctionnel (dev + prod)
	•	README propre et complet
	•	Tests backend opérationnels
	•	Application responsive

📝 Licence

MIT - Projet open-source

