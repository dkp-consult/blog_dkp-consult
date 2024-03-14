---
title: 'Notebook : De naïveté à la prise de conscience'
date: '2024-03-14'
tags: ['dev','notebook', 'security']
draft: false
summary: Après avoir négligé la protection d'un formulaire de contact sur mon site, je me suis retrouvé submergé par des centaines de spams. Une leçon de humilité et un rappel que, peu importe la taille de notre projet, la sécurité ne doit jamais être sous-estimée.
images: ['/static/images/spam-article.webp']
layout: PostLayout
canonicalUrl: https://blog.dkp-consult.be/blog/notebook/de-naivete-a-prise-de-conscience
---

![Du chaos à la clarté : La métamorphose de la cybersécurité et du développement web](/static/images/spam-article.webp "Une œuvre divisée en deux parties, illustrant la transformation dans le domaine de la cybersécurité et du développement web. À gauche, une tempête numérique avec des attaques de spam frappant une petite forteresse de site web faite de code, sur des blocs PHP instables. À droite, la forteresse évoluée, robuste, protégée par des couches de code et des mesures de cybersécurité, avec une ampoule symbolisant l'illumination en matière de sécurité web.")


# Comment un formulaire de contact m'a appris l'importance de la sécurité web : leçon d'une naïveté dépassée

Il y a une semaine, j’ai pris une **grosse leçon de développement**, mais surtout, j’ai appris de ma naïveté...

Il y a un an, j’ai dû, en **quatrième vitesse**, sortir un site de présentation professionnel, car je trouvais mon premier client pour un site vitrine + eshop (projet dont j’attends toujours les informations, cela dit en passant). Du coup, sur **2-3 jours**, je mets en place un simple site avec quelques infos de présentation et toutes les **mentions légales nécessaires**.

À l’époque, et toujours maintenant, je n’ai **aucune connaissance en PHP**, mais je me tue à faire un formulaire de contact en PHP. Dans l’urgence, je ne pense pas au **spamming** dudit formulaire et, par la suite, je me dis qu’il n’y a pas besoin de mettre quoi que ce soit en place. Qui va s’amuser à spammer mon formulaire ? Je ne suis ni une grosse boîte, ni quelqu’un de connu, donc bon... Puis, j’ai précédemment pris la peine de mettre en place divers éléments **SPF, DKIM, DMARC**, non sans mal.

Vous la voyez venir, **la connerie** ? Et c’est gagné ! La semaine dernière, je me suis pris environ **300 mails** sur une période allant de **21 h 30 à 4 h 30** du matin. Le truc le plus con dans l’histoire ? C’est qu’avant de chercher d’où venaient tous ces mails, j’ai d’abord fouillé les règles spams de ma boîte mail, pesté sur l’hébergeur... Enfin, vous pouvez imaginer l’idée.

À court de piste, je finis par ouvrir **Thunderbird** pour regarder de plus près ces différents mails, et ils ont tous un point commun qui ne m’avait pas sauté aux yeux, outre le **phishing foireux** en crypto, ils ont tous les mêmes infos et la même structure. Mais là encore, ça ne me saute pas aux yeux...

Je finis par analyser le **champ d’envoi** du mail, et je demande aussi à ChatGPT de m'interpréter les différentes informations qui s’y trouvent, et là, sa réponse me surprend dans un premier temps.

Le mail est envoyé depuis mon hébergeur, avec comme sujet une suite aléatoire de caractères et du contenu de phishing. Mais j’ai tout de même, dans l’en-tête, une IP et l’information que le mail est envoyé depuis mon site avec un **script PHP**.

Ok, bingo, j’ai trouvé. Je sais pourquoi la structure me parlait : ce sont les champs de mon formulaire de contact, et quelqu’un s’amuse à **spammer mon formulaire**...

J’ai voulu consulter l’IP utilisée, je suis tombé sur cette page et je n’ai pas encore été plus en profondeur.

![Page d'accès à un noeud Tor](/static/images/spam-ip-acces.png "Page d'accès à un noeud Tor")


*La priorité étant de résoudre ce problème.* Et rapidement, je me souviens avoir lu ou entendu dans un podcast, ou ailleurs, que parfois un simple **champ invisible à cocher** pouvait faire échouer les scripts basiques, car celui-ci est automatiquement complété.

En **deux temps, trois mouvements**, hop, j’ajoute ledit champ et je pousse en prod le fix.

Et voilà, **problème réglé**, plus aucun mail de spam depuis. Alors oui, c’est assez basique comme problème et il vient surtout de ma naïveté à ne pas avoir mis en place de protection complémentaire. Voulant éviter d’importer reCaptcha, j’avais laissé courir, mais on ne risque pas de m’y reprendre de sitôt.

Après tout, c’est avec ce genre d’erreurs que l’on apprend le plus vite et le plus profondément.

Pour ceux qui voudraient en savoir plus sur cette méthode, on l’appelle : **honeypot captcha**.


- [Mail](mailto:contact@dkp-consult.be)
- [Twitter](https://twitter.com/dkp_consult)
- [LinkedIn](https://www.linkedin.com/in/pierre-debski/)
- [Facebook](https://www.facebook.com/dkpconsult)