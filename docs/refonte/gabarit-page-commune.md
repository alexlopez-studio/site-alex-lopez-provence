# Gabarit de page commune — `/immobilier/[commune]`

Conçu une fois, réutilisé pour chaque commune. Sert deux familles de requêtes sur une seule page,
parce qu'un village de 500 à 2 000 habitants n'a pas le volume pour en justifier deux :
« prix m2 / estimation [commune] » (intention vendeur) et « agent immobilier [commune] »
(intention trouver quelqu'un).

**Objectif de conversion de la page : la demande d'estimation.** Pas le guide — le guide n'est
qu'un appel secondaire, discret, en bas.

---

## Balises

| Élément | Gabarit |
|---|---|
| URL | `/immobilier/[commune-slug]` |
| Title | `Immobilier à [Commune] : prix, marché et estimation \| Alexandre Lopez` |
| H1 | `Immobilier à [Commune] : ce que valent les maisons aujourd'hui` |
| Meta | `Prix des maisons à [Commune] d'après les ventes réellement enregistrées ([n] ventes en [année]). Marché, délais, estimation par un agent immobilier du secteur.` |

Afficher une **date de mise à jour visible** en haut de page. C'est un signal de fraîcheur pour le
lecteur, et ça t'oblige à tenir les pages.

---

## Structure

**1. Chapeau — 2 à 3 phrases.**
Ce que vaut une maison à [Commune] aujourd'hui, d'après les ventes enregistrées par l'administration
fiscale. Pas de superlatif, pas d'accroche commerciale. Le ton donne le registre de tout le site.

**2. H2 — Le marché de [Commune] en chiffres.**
Bloc de données issu du pipeline DVF, variables du skill newsletter :

- année de référence
- nombre de ventes de maisons — **affiché, toujours**
- prix médian
- prix médian au m²
- mention de la source : ventes enregistrées par la DGFiP (DVF)

Puis les deux paragraphes de marché générés pour la commune.

> Règle non négociable : le nombre d'observations est affiché à côté de chaque chiffre. Sur une
> commune à 6 ventes dans l'année, la page doit le dire et écrire que la médiane est indicative.
> Une fausse précision sur un village se voit, et se retourne contre toi le jour du rendez-vous.

**3. H2 — Ce qui fait la valeur d'une maison à [Commune].**
Le bloc qui justifie l'existence de la page, et **le seul qui ne peut pas être généré** : il doit
être écrit à la main, commune par commune. Village ou écart, terrain et constructibilité, exposition
et vue, accès, eau, assainissement collectif ou non, zone soumise au débroussaillement, ce qui se
vend vite et ce qui traîne ici. C'est ce bloc qui prouve que tu connais le terrain, et c'est lui
qui rend la page incopiable.

**4. H2 — Combien de temps pour vendre à [Commune].**
Délais observés, tension acheteurs, saisonnalité si elle existe. Honnête sur l'incertitude quand le
volume est faible.

**5. H2 — Votre agent immobilier à [Commune].**
Le bloc qui capte « agent immobilier [commune] ». Photo, qui tu es, ton secteur, ton standard de
production — photo, plan, vidéo — et ce que tu remets à un vendeur. Preuve concrète si tu en as une
sur la commune ou juste à côté : un bien suivi, une vente réalisée.

**6. H2 — Estimer votre maison à [Commune].**
CTA principal. Ce que contient ton rapport d'estimation, ce que ça engage (rien), sous quel délai.
Formulaire court ou bouton vers le formulaire d'estimation.

**7. Appel secondaire vers le guide.**
Une ligne, en bas, discrète : lien vers `/vendre-sans-agence`. Il ne doit jamais concurrencer
l'estimation sur cette page.

**8. FAQ — 3 questions locales.**
Formulées comme les gens les posent, réponses courtes. Balisage FAQ possible.

**9. Maillage.**
Communes voisines, page d'accueil, landing guide.

---

## Le piège à éviter

Une collection de pages bâties sur un gabarit produit du quasi-doublon, et des pages fines qui ne se
positionnent sur rien. Trois éléments doivent différer réellement d'une commune à l'autre : les
chiffres DVF, les deux paragraphes de marché, et surtout le bloc 3, écrit à la main.

Si le bloc 3 est générique, la page ne vaut rien — mieux vaut trois pages écrites que vingt pages
générées.

---

## Données à préparer par commune

Année de référence · nombre de ventes maisons · prix médian · prix médian au m² · les deux
paragraphes de marché · le texte manuel du bloc 3 · les trois questions de la FAQ · les communes
voisines à lier.
