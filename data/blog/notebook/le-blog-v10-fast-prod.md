---
title: Le Blog - V.1.0. - Fast prod
date: '2023-02-14'
tags: ['dev','notebook']
draft: false
summary: La mise en place du blog, les mésaventures et améliorations à venir.
images: ['/static/images/leblogv1.jpg']
layout: PostLayout
canonicalUrl: https://blog.dkp-consult.be/blog/notebook/le-blog-v10-fast-prod
---

![Image d'un laptop et d'un livre de code et d'un café](/static/images/leblogv1.jpg "Le Blog")

# Le blog - V.1.0. - Fast Prod

Dès les premières lignes de code, sans avoir même considéré le responsive, j’ai songé à faire un blog. Il était pensé en statique et généré manuellement avec une modification intégrale et un nouvel envoi sur le ftp. Puis j’ai appris…

Même si le choix de la techno fut compliqué, je suis satisfait du résultat aujourd’hui. Je n’avais pas envie d’utiliser une formule clé en main comme WordPress, j’avais envie d’avoir une nécessité de rentrer dans le code. Certains diront perdre du temps, d’autres prendre en compétences..

J’ai beaucoup hésité (Hugo, Gatsby, WP, etc), je suis tombé sur des problèmes, jusqu’au moment où j’ai trouvé un template sympa sur Vercel et là en 5 minutes, j’avais déployé le template intégralement. J’ai fait un coup de sonde et j’ai vu une vidéo sur le créateur de Vercel et NextJS, je me suis dit que c’était l’occasion de faire une découverte et prendre en compétence.

C’est parti, j’ai la solution technique, même si je n'y connaissais rien en NextJS. J’ai donc mis en place le blog avec un template avec Vercel et GitHub, le tout avec une redirection sur un sous-domaine. Avec un thème tout fait, c’est super simple. En quelques minutes, on peut déployer, mais il faut quand même personnaliser un minimum le tout et donc se plonger dans la structure du code. Voici les premiers constats de la mise en place et ce que je vais modifier à terme.

A l’installation, j’ai un nombre infini de node_modules et ça me gave. Je pense que certains sont inutilisés et je vais découvrir comment les identifier et nettoyer le projet afin de le rendre plus léger. Je suis les directives du fichier ReadMe et édite ce qui est préconisé, le tout sans trop de difficulté. Je commente les données peu pertinentes pour moi aujourd’hui, mais qui me serait utiles et je supprime les autres.

A la suppression de certaines fonctions (commentaires, etc) mais aussi de certains éléments du template (co-auteur), j’ai eu la blague de ne pas les enlever des fichiers de rendu, ce qui faisait foirer le build et comme j’y ai été YOLO c’était la version de prod qui plantait.

Comme j’avais modifié plein de choses, sans commit après chaque changement, impossible de savoir ce que j’avais cassé et surtout comment le réparer. Comment me sortir de cette impasse ? Easy, on va faire des tests empiriques.

J’avais donc deux projets: le blog personnalisé et le template. Et pour savoir ce qui faisait tout planter, je modifiais le template fonctionnel jusqu’au moment où le build plantait afin de cibler le fichier qui était mal modifié. J’ai donc appris à être méthodique dans l’édit du projet, entendez par là abuser du npm run build.

Et voilà, en quelques heures, le blog était sur les rails et consultable. Il reste maintenant à rédiger et à améliorer. Chaque amélioration me demandera d’en apprendre plus sur NextJS, en markdown.

Les pistes d’améliorations actuelles :

Partage sur Facebook et Twitter
Gagner en lisibilité
Avoir une ligne rédactionnelle
Nettoyer le projet
Améliorer le design
Bien entendu, je vais documenter les différentes améliorations apportées afin de rendre l'exercice sympa et partager mon retour d'expérience.