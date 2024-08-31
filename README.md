# Projet de Gestion des Équipements Sportifs

## Description
Ce projet est une API pour la gestion des équipements sportifs. Il permet de rechercher des équipements en fonction de différents filtres et de récupérer des informations détaillées sur un équipement spécifique.

## Technologies Utilisées
- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express** : Framework web pour Node.js.
- **TypeScript** : Sur-ensemble typé de JavaScript qui se compile en JavaScript simple.
- **JavaScript** : Langage principal utilisé pour le développement côté serveur.
- **npm** : Gestionnaire de paquets pour Node.js.

## Installation
1. Clonez le dépôt :
   ```bash
   git clone https://github.com/Ayriko/YSportMap-backend.git
   cd YSportMap-backend
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

## Utilisation
1. Démarrez le serveur :
   ```bash
   npx tsx src/index.ts
   ```

2. L'API sera accessible à `http://localhost:3000`. Attention Il faut créer un fichier .env et y joindre PORT=3000.

3. Le projet est pensé pour être utiliser avec le projet front-end : https://github.com/Ayriko/YSportMap-frontend(

## Endpoints
### GET `/api/v1/equipments`
Récupère une liste d'équipements en fonction des filtres fournis depuis le front.

### GET `/api/v1/equipments/:equip_numero`
Récupère les détails d'un équipement spécifique par son numéro.

## Licence
Ce projet est sous licence MIT.
```