# Compteur des API

Application de suivi des jets de dés et des séances de jeu de rôle.

## Installation

1. Cloner le dépôt :
```bash
git clone [URL_DU_REPO]
cd compteur-des-api
```

2. Installer les dépendances :
```bash
npm install
cd server
npm install
```

## Démarrage

### Mode développement
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur sera accessible à l'adresse : `http://localhost:3001`

## API Endpoints

- `GET /api/config` : Récupérer la configuration
- `POST /api/config` : Mettre à jour la configuration
- `GET /api/jets` : Récupérer les jets
- `POST /api/jets` : Ajouter un nouveau jet
- `DELETE /api/jets` : Supprimer tous les jets
- `GET /api/seances` : Récupérer les séances
- `POST /api/seances` : Ajouter une nouvelle séance
- `PUT /api/seances/:id` : Modifier une séance existante 
