# Océane — Une Expérience Narrative

Un site web personnel interactif et narratif, conçu comme un souvenir vivant pour Océane. Cette expérience de "scrollytelling" raconte une histoire à travers 8 scènes, avec des animations fluides, des vidéos d'ambiance, et une fin ludique.

## 🚀 Démarrage Rapide

### Prérequis
- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur de développement**
```bash
npm run dev
```

Le site sera accessible sur `http://localhost:3000`

3. **Build pour production**
```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`

## 📁 Structure du Projet

```
projet-oceane/
├── src/
│   ├── assets/
│   │   ├── videos/            # Vidéos pour les scènes (à ajouter)
│   │   ├── audio/              # Musique de fond (à ajouter)
│   │   └── images/             # Images additionnelles
│   ├── sections/               # Composants de scènes (futur)
│   ├── styles/
│   │   └── main.css           # Styles principaux
│   └── scripts/
│       └── main.js            # Logique JavaScript
├── index.html                  # Page principale
├── package.json               # Dépendances
├── vite.config.js            # Configuration Vite
└── README.md                  # Ce fichier
```

## 🎬 Ajout des Médias

### Vidéos

Placez vos fichiers vidéo dans `src/assets/videos/` :

- **scene1.mp4** : Scène d'ouverture (fond, plan large, ambiance douce)
- **scene2.mp4** : Scène souvenir (repas avant Ouaga)
- **scene4.mp4** : Scène âme (portrait en médaillon)

**Recommandations techniques :**
- Format : MP4 (H.264)
- Résolution : 1080x1920 (vertical, mobile-first)
- Bitrate : 2-3 Mbps
- Durée : 10-30 secondes (boucle)
- Audio : Non nécessaire (vidéos mutées pour autoplay)

### Audio

Placez votre fichier audio dans `src/assets/audio/` :

- **background.mp3** : Musique de fond ambiante

**Recommandations techniques :**
- Format : MP3
- Qualité : 192kbps ou supérieur
- Durée : 2-3 minutes (boucle)
- Style : Ambiant, doux, non intrusif

## 🎨 Personnalisation

### Modifier les textes

Tous les textes sont dans `index.html`. Cherchez les commentaires `<!-- SCÈNE X -->` pour trouver chaque section.

### Personnaliser la signature

À la fin du fichier `index.html`, remplacez `[ton prénom]` par votre prénom dans la Scène 8.

### Ajuster les couleurs

Les variables CSS sont dans `src/styles/main.css` :

```css
:root {
    --bg-primary: #0a0a0a;      /* Fond principal */
    --bg-secondary: #141414;    /* Fond secondaire */
    --text-primary: #f5f5f5;    /* Texte principal */
    --text-secondary: #a0a0a0;  /* Texte secondaire */
    --accent: #c9a87c;          /* Couleur d'accent */
}
```

## 📱 Optimisation Mobile

Le site est conçu **mobile-first** pour iPhone Safari :

- ✅ Utilisation de `100dvh` pour gérer la barre Safari
- ✅ Support des safe areas pour iPhone avec encoche/Dynamic Island
- ✅ Zones tactiles minimales de 44x44px
- ✅ Autoplay audio déclenché par interaction utilisateur
- ✅ Vidéos en `muted playsinline` pour autoplay iOS
- ✅ Smooth scroll optimisé pour tactile

## 🛠 Stack Technique

- **Vite** : Build tool et serveur de développement
- **GSAP + ScrollTrigger** : Animations au scroll
- **Lenis** : Smooth scroll premium
- **Howler.js** : Gestion audio avec support iOS
- **HTML/CSS/JS pur** : Pas de framework lourd

## 🚢 Déploiement

Le build génère des fichiers statiques dans `dist/` qui peuvent être déployés sur :

- **Netlify** : Glisser-déposer le dossier `dist/`
- **Vercel** : Connecter le repo et configurer le build
- **GitHub Pages** : Utiliser `gh-pages` pour le dossier `dist/`
- **Hébergement statique** : Tout hébergeur supportant les fichiers statiques

## 🎯 Fonctionnalités Clés

### 8 Scènes Narratives
1. **Landing** : Nom qui apparaît lettre par lettre
2. **Ouverture** : Gratitude avec vidéo de fond
3. **Souvenir** : Repas avant Ouaga
4. **Personnalité** : Traits de caractère
5. **Âme** : Singularité et authenticité
6. **Regrets** : Sincérité sur le passé
7. **Sous-entendu** : Suggestion sans affirmation
8. **Final** : Conclusion et appel à l'action

### Animations
- Révélation progressive du texte au scroll
- Parallax léger sur les vidéos
- Particules subtiles en arrière-plan
- Transitions fluides entre scènes

### Jeu Interactif
- Bouton "Non" qui s'échappe au survol/touch
- Messages taquin qui changent à chaque tentative
- Disparition progressive après 6 tentatives
- Bouton "Oui" qui pulse à la fin

## 🐛 Dépannage

### Audio ne démarre pas
- Sur iOS, l'audio doit être déclenché par une interaction utilisateur (c'est normal)
- Le bouton "Appuie pour commencer" lance la musique

### Vidéos ne s'affichent pas
- Vérifiez que les fichiers sont dans `src/assets/videos/`
- Les noms doivent être exactement : `scene1.mp4`, `scene2.mp4`, `scene4.mp4`
- Vérifiez le format (MP4 H.264)

### Scroll saccadé
- Vérifiez que Lenis est bien initialisé
- Réduisez la taille des vidéos si trop lourdes
- Testez sur un appareil mobile pour la performance

## 📝 Notes de Développement

Ce projet a été conçu pour être :
- **Émotionnel** : Chaque mot compte, chaque animation a un but
- **Personnel** : Pas de template générique, une direction artistique unique
- **Performant** : Optimisé pour mobile, chargement rapide
- **Accessible** : Fonctionne sur tous les appareils modernes

## 🤝 Support

Pour toute question ou problème technique, consultez la documentation des librairies utilisées :
- [GSAP](https://greensock.com/docs/)
- [Lenis](https://github.com/studio-freight/lenis)
- [Howler.js](https://howlerjs.com/)
- [Vite](https://vitejs.dev/)

---

*Créé avec ❤️ pour Océane*