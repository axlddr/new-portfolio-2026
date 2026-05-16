[case]
hero: header.png
hero-alt: Aperçu de l'interface redessinée
title: Agorapulse - Refonte du Social Listening
text: Agorapulse est une plateforme SaaS pour les gestionnaires de réseaux sociaux : publication, gestion des interactions, mesure d'impact. Le Social Listening y permet de surveiller les mentions d'une marque et d'analyser sa présence en ligne.

En 2023, Agorapulse cherchait à se repositionner sur un marché plus professionnel. Le Social Listening, fonctionnalité clé dans ce segment, avait besoin d'une refonte complète pour être à la hauteur.

Sur ce projet, j'étais le seul designer, responsable de toute la chaîne : recherche, idéation, tests et UI. Je travaillais en étroite collaboration avec mon Product Manager et mon Head of Design, au sein d'une équipe produit de trois personnes.
meta: Entreprise | Agorapulse
meta: Rôle | Product Designer
meta: Timeline | 2024

[block]

[section]
Contexte

[split-title]
title: Objectifs
text: Trois objectifs guidaient ce projet :

- **Réduire les deals perdus** liés aux lacunes de l'ancien Social Listening, avec un impact direct sur le revenu
- **Rattraper les solutions concurrentes** sur les fonctionnalités et la couverture des plateformes
- **Assurer une bonne adoption** dès le lancement, mesurée via la satisfaction utilisateurs et les métriques d'usage

[image]
src: before-listening.png
alt: Example de l'interface avant refonte
caption: Example de l'interface avant refonte

[split-title]
title: Pourquoi une refonte ?
text: Face aux solutions concurrentes, le Social Listening d'Agorapulse montrait clairement ses limites :

- **Couverture limitée :** uniquement les mentions directes et les hashtags Instagram, sans possibilité d'agréger les résultats entre réseaux
- **Profondeur insuffisante :** moins de réseaux supportés, moins de données, trop peu de fonctionnalités pour répondre aux attentes d'un public professionnel

[block]

[section]
Phase de recherche

[split-title]
title: Analyse du marché et de la concurrence
text: Pour comprendre où se situait Agorapulse dans l'écosystème, nous avons combiné plusieurs approches :

- **Benchmark concurrentiel :** les solutions concurrentes offraient deux avantages clés absents chez nous : l'analyse de sentiment et la construction de recherches multi-plateformes sur un même écran. Ce benchmark a aussi mis en lumière des erreurs d'expérience à éviter.
- **Étude de marché :** le State of Social Listening du Social Intelligence Lab nous a permis de mieux situer Agorapulse dans le marché et d'affiner notre positionnement.

[image]
src: useflow.png
alt: Extrait d'un user-flow simplifié de la feature avant refonte
caption: Extrait d'un user-flow simplifié de la feature avant refonte

[split-title]
title: Compréhension des utilisateurs
text: En parallèle, nous avons travaillé à mieux comprendre nos utilisateurs actuels et potentiels :

- **Feedback existant :** analyse des retours d'utilisateurs actuels et de prospects non convertis, complétée par des échanges avec les équipes support et marketing
- **User flows :** cartographie des parcours existants pour identifier les blocages et les limites de la solution actuelle
- **Interviews complémentaires :** sessions avec des leads potentiels et des utilisateurs clés pour compléter et challenger nos hypothèses

[image]
src: concu.png
alt: Extrait (anonymisé) de l'analyse de nos concurrents
caption: Extrait (anonymisé) de l'analyse de nos concurrents

[split-text]
text: Ces deux axes de recherche ont permis d'identifier quatre besoins principaux :

- Accéder à des données précises et actionnables sur la santé de la marque
- Produire des rapports à partir de ces données
- Suivre les tendances de leur industrie
- Comprendre la stratégie de leurs concurrents

À l'issue des interviews, nous avons décidé collectivement avec le PM et le Head of Design de concentrer le MVP sur ce premier besoin. L'objectif : releaser plus rapidement et commencer à itérer avec du vrai feedback utilisateur derrière.

[image]
src: before-listening-creation.png
alt: L'interface de création de l'ancienne feature, très limitée dans ses possibilités
caption: L'interface de création de l'ancienne feature, très limitée dans ses possibilités

[section]
Idéation et conception

[split-title]
title: Le design sprint
text: Un design sprint a été organisé avec les parties prenantes clés : Product Manager, Head of Design, Engineering Manager et Product Designer. Impliquer ces profils dès le départ a permis de trancher rapidement sur les pistes à explorer.

Le sprint s'est articulé en trois temps :

- **Cadrage du MVP :** définition du périmètre autour du besoin principal, la surveillance de la santé de la marque via des données précises
- **Ateliers de conception :** 6-to-1, card sorting et explorations papier pour converger vers les pistes les plus solides
- **Wireframing :** une fois l'arborescence validée, exploration en low-fidelity pour poser les bases de la structure des pages

[image]
src: wireframes.png
alt: Examples de wireframes étudiés à différents stades du sprint
caption: Examples de wireframes étudiés à différents stades du sprint

[split-title]
title: Tests d'utilisabilité
text: Une fois une piste validée en fin de sprint, nous l'avons prototypée et testée suivant un protocole précis, en interne avec les équipes support et marketing, puis en externe avec une dizaine d'utilisateurs réels.

Les résultats étaient solides : 8 utilisateurs sur 10 ont réussi à construire une recherche de façon autonome. Près de la moitié ont cependant bloqué sur une même fonctionnalité, ce qui nous a permis de la retravailler avant la release. Les tests ont aussi fait remonter des besoins pour les prochaines itérations :

- Plus de données disponibles
- La possibilité d'interagir directement avec les posts depuis l'outil

[image]
src: prototype.png
alt: Visualisation du prototype mis dans les mains des utilisateurs leurs de leur session de test
caption: Visualisation du prototype mis dans les mains des utilisateurs leurs de leur session de test

[section]
Design haute fidélité

[split-title]
title: Arbitrages et décisions
text: Ce travail a aussi été l'occasion de prendre des décisions concrètes avec l'équipe. Un exemple : j'avais prévu d'inclure les "top posts" directement dans le panneau de données à gauche. En échangeant avec l'engineering, on a réalisé que l'implémentation représentait un coût disproportionné par rapport à la valeur ajoutée, d'autant qu'un workaround existait : filtrer par engagement dans la vue des items à droite couvrait le même besoin. On a coupé la fonctionnalité et gardé l'énergie pour des éléments plus impactants.

[image]
src: search-dashboard.png
alt: L'écran d'accès rapide à toutes les recherches créées par l'utilisateur
caption: L'écran d'accès rapide à toutes les recherches créées par l'utilisateur

[split-title]
title: Arbitrages et décisions
text: Avec un design system solide en place, la phase haute fidélité a avancé rapidement, mais il s'agissait aussi de s'assurer que la fonctionnalité s'intègre sans friction dans un produit existant, tout en posant les bases d'un bon suivi post-lancement.

- **Accessibilité :** contrastes, wording clair, lisibilité des données
- **Design d'interaction :** absent du prototype de test, mais essentiel pour le confort d'utilisation au quotidien
- **Cohérence produit :** alignement avec les trois autres designers travaillant en parallèle, pour conserver des structures de pages communes
- **Instrumentation :** définition des éléments à tracker pour assurer un suivi des KPIs dès le lancement

[image]
src: search-builder.png
alt: Le créateur de recherche, qui permet de combiner facilement plusieurs réseaux et d'écouter hashtags, mentions et mots clés.
caption: Le créateur de recherche, qui permet de combiner facilement plusieurs réseaux et d'écouter hashtags, mentions et mots clés.

[section]
Fin du projet

[split-title]
title: Développement et lancement
text: Le développement a démarré à la livraison des écrans, avec quelques imprévus côté APIs, notamment Twitter, qui ont allongé les délais.

Une bêta fermée a précédé l'ouverture au grand public. Les retours ont permis de corriger plusieurs points bloquants et d'itérer rapidement avant la release. Par exemple, la suppression d'une étape dans le parcours de création d'une search a fait passer le taux de complétion de 30% à 80%.

[image]
src: search-views.png
alt: Example d'un écran haute fidélité pour le dashboard récaputilatif des données et des posts associés
caption: Example d'un écran haute fidélité pour le dashboard récaputilatif des données et des posts associés

[split-title]
title: Résultats et impact
text: Quelques semaines après l'ouverture au grand public, les KPIs fixés en amont montraient des résultats encourageants :

- **Deals perdus** liés aux lacunes du Social Listening : de 5 par mois à 1
- **Croissance du revenu :** une augmentation constante du nombre de searches créées depuis le lancement, vendues en add-on à l'unité

[split-title]
title: Conclusion
text: Un projet qui m'a demandé de jongler entre recherche, cadrage stratégique et exécution, tout en maintenant un lien constant avec les utilisateurs pour rester ancré dans leurs besoins réels.

La fonctionnalité a depuis continué d'évoluer, avec l'ajout de l'analyse de sentiment et de l'écoute des blogs et sites de news.

Avec du recul, deux choses que je ferais différemment :

- **Anticiper les contraintes APIs dès le cadrage**, pour éviter les imprévus en phase de développement
- **Réduire encore le scope du MVP :** certaines fonctionnalités ont dû être coupées pendant la bêta pour tenir les délais. Partir plus petit aurait permis de lancer plus tôt et d'itérer plus vite.