---
title: 'Vider le cache DNS'
date: '2025-01-16'
tags: ['tips', 'dns', 'navigateur', 'systèmes']
draft: false
summary: Vider le cache DNS peut résoudre des problèmes d’accès aux sites Web, notamment après un changement de serveur ou d’adresse IP. Ce guide est un rappel de comment effectuer cette opération sur les navigateurs et principaux systèmes d'exploitation.
images: ['/static/images/dns_tips.webp']
layout: PostSimple
canonicalUrl: https://blog.dkp-consult.be/blog/tips/cache-dns
---

# Vider le cache DNS de votre navigateur et de votre machine ?

## Vider le cache DNS dans les navigateurs

### Chrome et navigateurs basés sur Chromium
Navigateurs concernés : Google Chrome, Microsoft Edge, Brave, Opera, Vivaldi, etc.

1. Ouvrez un nouvel onglet.
2. Saisissez `chrome://net-internals/#dns` dans la barre de recherche et appuyez sur **Entrée**.
3. Cliquez sur **Clear host cache**.
4. Dans le menu à gauche, sélectionnez **Sockets**.
5. Cliquez sur **Flush socket pools**.

### Firefox

1. Ouvrez un nouvel onglet.
2. Saisissez `about:networking#dns` dans la barre de recherche et appuyez sur **Entrée**.
3. Cliquez sur **Vider le cache DNS**, puis sur **Actualiser**.

### Safari

1. Ouvrez le menu **Safari** et allez dans **Préférences**.
2. Dans l’onglet **Avancé**, cochez **Afficher le menu Développement dans la barre des menus**.
3. Dans le menu **Développement**, cliquez sur **Vider les caches**.

---

## Vider le cache DNS de votre machine

### Windows

1. Ouvrez l’invite de commandes (**CMD**) en mode administrateur :  
    - Recherchez **cmd** dans le menu Démarrer, faites un clic droit, et sélectionnez **Exécuter en tant qu’administrateur**.
2. Tapez la commande suivante et appuyez sur **Entrée** :  
    ```bash
    ipconfig /flushdns
    ```
3. Vous verrez un message confirmant que le cache DNS a été vidé.

### macOS

1. Ouvrez l’application Terminal.
2. Saisissez la commande suivante en fonction de votre version de macOS :
    - Pour macOS Ventura et versions ultérieures :
      ```bash
      sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
      ```
    - Pour macOS Big Sur et Monterey :
      ```bash
      sudo killall -HUP mDNSResponder
      ```
3. Appuyez sur **Entrée** et saisissez votre mot de passe si demandé.

### Linux

1. Ouvrez un terminal.
2. Selon votre distribution, utilisez l’une des commandes suivantes :
    - Pour les distributions basées sur systemd :
      ```bash
      sudo systemctl restart systemd-resolved
      ```
    - Pour les autres distributions :
      ```bash
      sudo service dns-clean restart
      ```