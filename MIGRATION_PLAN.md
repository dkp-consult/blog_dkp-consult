# Plan de Migration - Blog DKP Consult

## 📋 Vue d'ensemble

**Objectif** : Migrer le blog de Next.js 12.1.4 vers Next.js 14.x avec React 18
**Durée estimée** : 2-4 heures
**Risque** : Modéré (breaking changes importants)

## 🔍 État actuel vs Cible

| Composant | Version actuelle | Version cible | Criticité |
|-----------|------------------|---------------|-----------|
| Next.js | 12.1.4 | 14.2.x | 🔴 Critique |
| React | 17.0.2 | 18.2.x | 🔴 Critique |
| React DOM | 17.0.2 | 18.2.x | 🔴 Critique |
| Node.js | 24.2.0 | ✅ Compatible | ✅ OK |

## 🚀 Plan de migration étape par étape

### Phase 1 : Préparation et sauvegarde

#### 1.1 Sauvegarde complète
```bash
# Créer une branche de sauvegarde
git checkout -b backup-before-migration
git push origin backup-before-migration

# Revenir sur main/master
git checkout main

# Créer la branche de migration
git checkout -b migration-nextjs-14
```

#### 1.2 Audit des dépendances
```bash
# Vérifier les vulnérabilités actuelles
npm audit

# Lister les packages obsolètes
npm outdated
```

### Phase 2 : Migration Next.js progressive

#### 2.1 Étape 1 : Next.js 12.1.4 → 12.3.4
```bash
npm install next@12.3.4 eslint-config-next@12.3.4
npm run build
npm run dev
```

**Vérifications :**
- [ ] Le site se lance sans erreur
- [ ] Les pages MDX se chargent correctement
- [ ] La génération de sitemap fonctionne
- [ ] Les images Sharp sont optimisées

#### 2.2 Étape 2 : Next.js 12.3.4 → 13.5.6
```bash
npm install next@13.5.6 eslint-config-next@13.5.6
```

**⚠️ Breaking changes Next.js 13 :**
- `next/image` : Nouveau comportement par défaut
- Middleware : Changements d'API
- `next/font` : Nouvelle API (optionnel)

**Corrections nécessaires :**

1. **Mise à jour next.config.js** (si nécessaire)
```javascript
// Ajouter si des problèmes d'images
const nextConfig = {
  // ... config existante
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}
```

#### 2.3 Étape 3 : Next.js 13.5.6 → 14.2.x
```bash
npm install next@latest eslint-config-next@latest
```

**⚠️ Breaking changes Next.js 14 :**
- Turbopack (optionnel)
- Server Actions stables
- Améliorations des performances

### Phase 3 : Migration React 18

#### 3.1 Mise à jour React
```bash
npm install react@latest react-dom@latest
```

#### 3.2 Corrections React 18 obligatoires

**1. Mise à jour de _app.js**
```javascript
// pages/_app.js - AVANT
import { ThemeProvider } from 'next-themes'
import { ClientReload } from '@/components/ClientReload'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}

// pages/_app.js - APRÈS (React 18)
import { ThemeProvider } from 'next-themes'
import { ClientReload } from '@/components/ClientReload'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider attribute="class" defaultTheme={siteMetadata.theme}>
      <Head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
      </Head>
      {isDevelopment && <ClientReload />}
      <Analytics />
      <LayoutWrapper>
        <Component {...pageProps} />
      </LayoutWrapper>
    </ThemeProvider>
  )
}
```

**2. Vérification des composants avec Hydration**
- Vérifier `components/ThemeSwitch.js`
- Vérifier `components/ClientReload.js`
- Tester les composants interactifs

### Phase 4 : Mise à jour des dépendances critiques

#### 4.1 Dépendances MDX
```bash
# Vérifier la compatibilité
npm install mdx-bundler@latest

# Si problèmes, alternatives :
# npm install @next/mdx @mdx-js/loader @mdx-js/react
```

#### 4.2 Dépendances Tailwind
```bash
npm install @tailwindcss/forms@latest @tailwindcss/typography@latest
npm install tailwindcss@latest autoprefixer@latest postcss@latest
```

#### 4.3 Autres dépendances importantes
```bash
npm install sharp@latest
npm install @next/bundle-analyzer@latest
npm install next-themes@latest
```

### Phase 5 : Tests et vérifications

#### 5.1 Tests de fonctionnement
```bash
# Build de production
npm run build

# Test du serveur
npm run serve

# Vérification du lint
npm run lint

# Test de l'analyse
npm run analyze
```

#### 5.2 Checklist de vérification

**🔍 Pages et navigation :**
- [ ] Page d'accueil se charge
- [ ] Pages de blog individuelles
- [ ] Navigation entre les pages
- [ ] Page À propos
- [ ] Page Projets
- [ ] Page Sujets/Tags

**🔍 Fonctionnalités :**
- [ ] Changement de thème (dark/light)
- [ ] Recherche et filtrage
- [ ] Pagination
- [ ] Partage social
- [ ] Formulaire newsletter
- [ ] Commentaires (si activés)

**🔍 Performance :**
- [ ] Images optimisées
- [ ] Temps de chargement < 3s
- [ ] Score Lighthouse > 90
- [ ] Génération de sitemap
- [ ] RSS feed

**🔍 SEO et métadonnées :**
- [ ] Balises meta correctes
- [ ] Open Graph
- [ ] Schema.org
- [ ] Robots.txt
- [ ] Sitemap.xml

### Phase 6 : Optimisations post-migration

#### 6.1 Nettoyage
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install

# Audit de sécurité
npm audit fix
```

#### 6.2 Optimisations Next.js 14
```javascript
// next.config.js - Optimisations
const nextConfig = {
  // ... config existante
  
  // Nouvelles optimisations Next.js 14
  experimental: {
    optimizePackageImports: ['@tailwindcss/typography'],
  },
  
  // Amélioration des performances
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

## 🚨 Points d'attention critiques

### Problèmes potentiels et solutions

**1. Erreurs d'hydration React 18**
```javascript
// Si erreurs d'hydration, ajouter suppressHydrationWarning
<div suppressHydrationWarning>
  {/* Contenu qui peut différer côté serveur/client */}
</div>
```

**2. Problèmes avec Preact**
```javascript
// Dans next.config.js, vérifier la compatibilité Preact avec React 18
// Possibilité de désactiver temporairement :
if (!dev && !isServer) {
  // Commenter temporairement le remplacement Preact
  // Object.assign(config.resolve.alias, { ... })
}
```

**3. MDX bundler incompatible**
```bash
# Si mdx-bundler pose problème, migrer vers @next/mdx
npm uninstall mdx-bundler
npm install @next/mdx @mdx-js/loader @mdx-js/react
```

**4. Sharp et optimisation d'images**
```bash
# Si problèmes avec Sharp
npm uninstall sharp
npm install sharp@latest
```

## 📊 Rollback plan

En cas de problème critique :

```bash
# Retour à la version précédente
git checkout backup-before-migration
git checkout -b hotfix-rollback

# Ou restauration sélective
git checkout backup-before-migration -- package.json package-lock.json
npm install
```

## 🎯 Validation finale

### Tests de production
```bash
# Build final
npm run build

# Test local de production
npm run serve

# Vérification des performances
npm run analyze
```

### Déploiement
```bash
# Commit des changements
git add .
git commit -m "feat: migrate to Next.js 14 and React 18

- Update Next.js from 12.1.4 to 14.2.x
- Update React from 17.0.2 to 18.2.x  
- Update all related dependencies
- Fix hydration issues
- Maintain backward compatibility
- Improve performance and security"

# Push vers la branche de migration
git push origin migration-nextjs-14

# Créer une PR pour review
```

## 📝 Notes importantes

- **Durée estimée** : 2-4 heures selon les problèmes rencontrés
- **Moment optimal** : En dehors des heures de pointe
- **Backup obligatoire** : Avant toute modification
- **Tests requis** : Sur environnement de staging avant production

## 🔗 Ressources utiles

- [Guide de migration Next.js 13](https://nextjs.org/docs/pages/building-your-application/upgrading/version-13)
- [Guide de migration Next.js 14](https://nextjs.org/docs/pages/building-your-application/upgrading/version-14)
- [React 18 Upgrade Guide](https://react.dev/blog/2022/03/08/react-18-upgrade-guide)
- [MDX Migration Guide](https://mdxjs.com/migrating/v2/)

---

**Créé le :** $(date)
**Dernière mise à jour :** $(date)
**Statut :** 🟡 Prêt pour exécution