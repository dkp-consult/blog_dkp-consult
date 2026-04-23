# Refonte UI / UX du blog dkp-consult

Document de cadrage — deux variantes chiffrées pour la refonte du blog en alignement avec l'identité visuelle DKP-CONSULT.

## Contexte

Le blog repose actuellement sur le template `tailwind-nextjs-starter-blog` avec des paramètres par défaut qui ne reflètent pas l'identité de la marque :

- `primary: colors.teal` (Tailwind default) → **hors-marque** : le teal n'a rien à voir avec l'orange DKP.
- `gray: colors.neutral` → correct, à conserver.
- Police : Inter Variable, déjà chargée via `@fontsource/inter`.
- Header / footer : markup générique, aucun signe distinctif.

## Identité de marque (extraite des supports DKP)

Sources : devis 2026-003, note de cadrage projet BAL Conseils, logo SVG.

### Palette

| Usage | Hex |
|---|---|
| Orange signature (logo, titres de section, montants, liens) | `#F1943D` |
| Gris moyen (éléments géométriques secondaires) | `#545454` |
| Noir doux (texte, wordmark DKP) | `#100F0D` |
| Gris clair (panneaux, filets) | `#D9D9D9` |
| Blanc | `#FFFFFF` |

### Typographie

- Humanist sans (Open Sans / Source Sans Pro sur les docs — **Inter** fait parfaitement l'équivalent sur le web).
- Hiérarchie nette, labels fréquemment en uppercase et orange.
- Graisse modérée pour les titres (pas d'extra-bold généralisé).

### Ton éditorial

Transparent, structuré, direct, chaleureux-pro. Deux phrases typiques extraites de la note de cadrage : « Aucune zone grise », « Un projet qui avance bien, c'est un projet où les allers-retours se font en jours, pas en semaines ».

### Logo

Mark géométrique riche (triangles imbriqués) actuellement sous-exploité sur le blog. Fort potentiel pour :
- Favicon SVG (actuellement manquant ou générique).
- Accents graphiques ponctuels (séparateurs, filets, motifs de fond de hero).
- Cover/social banner plus cohérente.

---

## Option Medium — refonte propre (~1 journée) *[recommandée]*

Objectif : le blog doit **sentir DKP** sans refaire le design system au complet. On remplace la peinture et on corrige les gros écarts.

### Scope

1. **Palette primary**
   - Définir une échelle `primary` 50→900 centrée sur `#F1943D` dans `tailwind.config.js`.
   - Remplacer `colors.teal` par cette palette custom.
   - Ajuster les tons d'accentuation dans la prose (liens, `strong`, `blockquote`, inline `code`) pour éviter le rose-sur-orange actuel.

2. **Home**
   - Vraie section hero : intro courte (tagline « Entre lignes de code et lignes de vie »), signature visuelle (logo ou accent géo), possiblement 1 ou 2 articles « phares » mis en avant.
   - Liste d'articles en dessous avec cards repensées : bordure fine, date en orange small-caps, tags en pilules discrètes, hover subtil.
   - SearchBar reste centrée comme aujourd'hui.

3. **Header**
   - Espacements affinés.
   - Hover des liens en orange (au lieu du gris actuel).
   - Logo en version compacte sur mobile.

4. **Footer**
   - Logo réutilisé en petit, avec la tagline DKP.
   - Icônes sociales harmonisées en gris foncé, hover orange.
   - Année + mention « dkp-consult.be » propre.

5. **Dark mode**
   - Recalibrer les surfaces et accents sur la palette orange (l'orange actuel du teal est glacial en dark).
   - Vérifier les contrastes AA sur texte / liens / tags.

6. **Page `/a-propos`**
   - Restyle cohérent avec l'univers (tableau des infos type « Client / Adresse / Prestataire » du devis, en version blog : « Qui / Où / Stack / Dispo »).

7. **Meta / favicon**
   - Favicon SVG à partir du logo.
   - `theme-color` meta (orange DKP pour barre mobile).
   - OG image par défaut (cover-dkp.png) vérifiée / harmonisée.

### Livrables attendus

- `tailwind.config.js` : palette `primary` custom documentée.
- Composants modifiés : `LayoutWrapper`, `Footer`, `Card` (si existant, sinon création), `Tag`, `Link`, `SearchBar`.
- Pages touchées : `index.js`, `a-propos.js`.
- Assets : `public/static/favicon.svg` (ou réutilisation de `data/logo.svg`).
- Build vert, lint propre, sanity-check navigateur (home + un article + `/sujets` + `/blog`).

### Ce qui reste intouché

- Mise en page des articles (`PostLayout`, `PostSimple`) → audit rapide, ajustements cosmétiques uniquement.
- Structure des routes.
- Tailwind config global (en dehors de `primary` et des accents prose).
- Toolchain (next, eslint, etc.).

### Risques

- Équilibrer l'orange sans qu'il devienne agressif : il faut soigner les teintes 400/500/600 et limiter l'usage des `bg-primary` pleines sur grandes surfaces.
- Dark mode : l'orange vif peut baver, prévoir une variante légèrement désaturée pour le mode sombre.

---

## Option Ambitious — refonte design system complète (~2-3 jours)

Objectif : faire du blog un support éditorial avec une vraie personnalité, pas juste « un starter customisé ». Inclut **tout le Medium**, plus :

### Scope additionnel

1. **Pairing typographique**
   - Display font distincte pour les titres (h1, h2 de page). Candidats à tester :
     - **Fraunces** — serif variable moderne, chaleureux, contrasté. Joue bien avec Inter. Personnalité éditoriale.
     - **Space Grotesk** — grotesque contemporain, personnalité tech sans être froid.
     - **Sora** — géométrique épuré, cohérent avec le mark triangulaire du logo.
   - Inter conservé pour le body.
   - Chargement via `@fontsource/*` (cohérent avec l'existant).

2. **Accents géométriques**
   - Exploiter la grammaire triangulaire du logo :
     - Séparateurs de section en petits triangles orange.
     - Motif de fond subtil sur la hero (SVG très basse opacité).
     - Marqueurs de liste custom.

3. **Article page**
   - TOC latéral sticky sur desktop (l'infra est déjà là via `remark-toc-headings` + `TOCInline`, il faut extraire et sticky-positioner).
   - Barre de progression de lecture en haut de page.
   - Largeur de prose repensée (lignes à 65-75 char).
   - Meta article (date, reading time, tags) restylisée : alignée à gauche, uppercase, orange.
   - Partage social (Twitter / LinkedIn / mail) repensé en fin d'article.

4. **Listings filtrables**
   - Sur `/sujets` et `/blog`, chips de tags réellement cliquables avec état actif visuellement marqué.
   - Tri date / popularité (léger).

5. **Motion**
   - Fade-in léger au scroll (Intersection Observer, pas de lib).
   - Transition de hover sur cards / tags / liens.
   - Pas de gros effets — cohérent avec le ton « sobre pro ».

6. **Cover / social banner**
   - Refaire `cover-dkp.png` et `twitter-card.png` cohérents avec la charte, avec typo et accent géo.

7. **Favicon animé ou adaptif**
   - SVG avec `prefers-color-scheme` → couleurs légèrement différentes en light / dark.

8. **Composants design system**
   - Extraire un vrai set de composants stylistiques : `<Callout>` (note, warning, info), `<Quote>`, `<StatCard>` pour MDX.
   - Les rendre dispo via `MDXComponents.js` pour qu'ils soient utilisables dans les articles.

### Livrables additionnels

- `css/tailwind.css` : ajout de couches (base, composants) avec règles typo et accents.
- Nouveaux composants : `<ReadingProgress>`, `<Callout>`, peut-être `<StickyTOC>`.
- Refactor `PostLayout` / `PostSimple` si nécessaire pour la TOC sticky.
- Assets visuels refaits.
- Build et tests manuels comme Medium, plus vérification des perfs (Lighthouse sur une article-page).

### Risques

- Scope creep : chaque item « motion », « TOC sticky », « pairing typo » a ses pièges. À découper en sous-tâches si on engage.
- Pairing typo mal calibré = illisible. Prévoir un A/B rapide avant de trancher la display font.
- Dark mode + pattern SVG de fond : attention à ne pas casser le contraste du texte.

---

## Hors scope de ces deux variantes

- Redesign du logo lui-même (hors périmètre blog — c'est un chantier branding séparé).
- Migration Pages Router → App Router (chantier technique, pas design).
- Refonte de la charte éditoriale / ligne éditoriale (contenu).
- Retrait de l'alias Preact en production (chantier séparé, déjà identifié dans le backlog).

## Décision à prendre

- **Variante** : Medium ou Ambitious ?
- **Pairing typo** : Inter seul (Medium) ou display font distincte (Ambitious) ? Si Ambitious, laquelle — Fraunces / Space Grotesk / Sora ?
- **Priorité dans l'Ambitious** : si on retient Ambitious mais qu'il faut découper, quel axe en premier (pairing typo, page article, accents géo) ?
