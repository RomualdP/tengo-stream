# Tengo Streams - Plan de développement

## Objectifs
Implémenter la fonctionnalité Streams avec :
1. Scroll infini pour les marchés
2. Décisions interactives (Rejeter/À analyser) avec masquage des cartes
3. Compteur dynamique des marchés restants

## Architecture technique
- **Frontend** : React + Mantine + TypeScript
- **Backend** : API mock existante (Express)
- **Structure** : Feature-based architecture avec hooks personnalisés

## Tâches de développement (Approche incrémentale)

### Phase 1 : Setup et configuration
- [ ] **1.1** Installer et configurer Mantine
  - Installation des packages @mantine/core, @mantine/hooks
  - Configuration du MantineProvider
  - Setup des thèmes de base
- [ ] **1.2** Créer la structure de dossiers
  - Dossier features/streams/
  - Composants, hooks, services, types
  - Structure feature-based

### Phase 2 : Version statique (MVP)
- [ ] **2.1** Définir les types TypeScript
  - Interface Tender basée sur les données mock
  - Types pour les décisions (TO_ANALYZE, REJECTED)
  - Types pour la pagination et les réponses API
- [ ] **2.2** Composant TenderCard (statique)
  - Affichage des informations du marché
  - Boutons "Rejeter" et "À analyser" (non fonctionnels)
  - Design basé sur l'interface Tengo
- [ ] **2.3** Composant TenderList (statique)
  - Liste des cartes de marchés
  - Données mockées en dur
  - Pas de scroll infini pour l'instant
- [ ] **2.4** Composant StreamCounter (statique)
  - Affichage du nombre de marchés restants
  - Valeur fixe pour l'instant
- [ ] **2.5** Header mocké
  - Logo Tengo
  - Navigation tabs
  - Barre de recherche
  - Profil utilisateur
- [ ] **2.6** Page principale (statique)
  - Intégration de tous les composants
  - Layout responsive avec Mantine
  - Données mockées

### Phase 3 : Intégration API
- [ ] **3.1** Service API
  - Fonction pour récupérer les marchés (POST /tenders/search)
  - Fonction pour enregistrer les décisions (POST /interactions/decisionStatus)
  - Gestion des erreurs et types de retour
- [ ] **3.2** Remplacer les données mockées
  - Chargement des vrais données depuis l'API
  - Gestion des états de chargement
  - Affichage des erreurs

### Phase 4 : Fonctionnalités interactives
- [ ] **4.1** Gestion des décisions
  - Fonctionnalité des boutons "Rejeter" et "À analyser"
  - Masquage des cartes après décision
  - Appels API pour enregistrer les décisions
- [ ] **4.2** Compteur dynamique
  - Mise à jour du compteur après chaque décision
  - Synchronisation frontend/backend

### Phase 5 : Scroll infini
- [ ] **5.1** Hook useInfiniteScroll
  - Intersection Observer pour détecter le scroll
  - Gestion de la pagination automatique
  - Prévention des appels multiples
- [ ] **5.2** Intégration du scroll infini
  - Remplacement de la liste statique
  - Gestion des états de chargement
  - Optimisation des performances

### Phase 6 : Optimisations et finalisation
- [ ] **6.1** Gestion des erreurs avancée
  - Messages d'erreur utilisateur
  - Retry automatique
  - États de fallback
- [ ] **6.2** Optimisations
  - Mémorisation des composants
  - Optimisation des re-renders
  - Gestion de la mémoire
- [ ] **6.3** Tests et documentation
  - Tests unitaires des composants
  - Tests d'intégration
  - Documentation des composants

## Critères de validation
- ✅ Scroll infini fonctionnel
- ✅ Décisions masquent les cartes
- ✅ Compteur se décrémente correctement
- ✅ Pas d'erreurs TypeScript/ESLint
- ✅ Interface responsive
- ✅ Gestion d'erreurs robuste

## Notes de développement
- Chaque tâche doit être validée avant de passer à la suivante
- Commit après chaque fonctionnalité complétée
- Respecter les règles de code (clean code, TypeScript strict)
- Utiliser Mantine pour tous les composants UI
- Architecture feature-based avec séparation des responsabilités
