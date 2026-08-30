# Fermeture des API backoffice — 29 août 2026

Note de traçabilité. Ce qui était ouvert, ce qui a été fait, ce qui reste à
vérifier côté production.

Travail local sur `preview`, **rien de commité, rien de poussé**.

---

## 1. Ce qui était ouvert

`src/middleware.ts` portait `matcher: []` depuis le commit `98d6df9` (17/06).
Ce middleware étant la **seule** barrière d'authentification du projet — aucune
page `/admin/*` ne fait sa propre vérification — tout le backoffice était
accessible sans session.

Le problème ne s'arrêtait pas à l'interface. Les routes API utilisent
`supabaseAdmin`, le client *service-role* de Supabase, qui court-circuite les
règles RLS de la base. Elles ne dépendaient donc d'aucune protection résiduelle.

**Constaté en exécution** (build de production local, base distante de
`.env.local`) : 21 endpoints en lecture répondaient 200 sans session.

| Endpoint | Ce qu'il renvoyait |
|---|---|
| `/api/market/warm-contacts` | 201 contacts — `full_name`, `phone`, `email` |
| `/api/market/opportunities` | 9 opportunités — `seller_name`, `seller_phone`, `seller_email`, `property_address`, `internal_intel` |
| `/api/leads/list` | 11 leads — nom, prénom, email, téléphone, adresse |
| `/api/market/properties` | 192 Ko |
| `/api/market/dvf/transactions` | 172 Ko |

Et il ne s'agissait pas que de lecture. Sans garde non plus :
`/api/market/properties` exposait **DELETE**, `/api/market/warm-contacts` et
`/api/market/opportunities` exposaient **POST**. Ces méthodes n'ont pas été
testées — seuls des GET ont été émis — mais le code est explicite.

## 2. Ce qui a été fait

**Middleware réactivé.** `matcher: ['/admin/:path*', '/dashboard/:path*',
'/app/:path*']`. Le commentaire du fichier documente désormais qu'il ne couvre
pas `/api/*`, pour éviter que la même illusion de protection se reforme.

**Garde appliqué à 46 routes / 72 handlers.** Via `rejectIfNoAdmin()` de
`src/lib/market/client-admin.ts`, qui existait déjà et protégeait correctement
six routes — il n'était simplement pas appliqué ailleurs. Périmètre : tout
`/api/market/*` hors webhooks, plus `/api/leads/list`, `/api/leads/stats`,
`/api/leads/[id]*` et `/api/leads/manual`.

**Volontairement non touchés**, chacun ayant son propre mécanisme :

| Route | Protection existante |
|---|---|
| `/api/leads` POST | **aucune, et c'est voulu** — formulaire public, appelé par 10 fichiers front |
| `/api/contact`, `/api/estimation`, `/api/audit`, `/api/guide/download` | idem, conversions publiques |
| `/api/admin/bootstrap` | secret partagé `ADMIN_BOOTSTRAP_SECRET` |
| `/api/admin/users*` | contrôle superuser (403) |
| `/api/client/invite` | `getCurrentAdmin()` |
| `/api/market/webhooks/stream-estate`, `/api/jobs/*` | secret partagé |

**Point de vigilance sur le garde.** `rejectIfNoAdmin()` retourne `null` quand
`NODE_ENV !== 'production'` : en `npm run dev`, les routes restent ouvertes sans
session. C'est pratique au quotidien, mais ça veut dire qu'un test en dev ne
prouve jamais que la protection fonctionne. Toute vérification doit passer par
`npm run build && npm run start`.

## 3. Vérification

Build vert (113/113), `tsc --noEmit` à 0, puis serveur de production local :

| Contrôle | Résultat |
|---|---|
| 20 endpoints auparavant ouverts | **20/20 en 401** `{"error":"Accès admin requis"}` |
| `/app/dashboard`, `/app/leads` | 307 → `/admin/login?redirect=…` |
| Site public (9 URLs) | 200, inchangé |
| `/api/leads`, `/api/contact`, `/api/guide/download` | POST corps vide → **400**, pas 401 (donc joignables) |

Les formulaires ont été sondés avec un corps vide précisément pour ne pas créer
de faux lead dans le CRM.

## 4. Ce qui reste à faire

1. **Confirmer l'exposition en production.** Tout ceci a été constaté en local.
   Comme `matcher: []` était commité sur `preview`, tout déploiement issu de
   cette branche portait le même trou — mais ça reste à vérifier sur
   alexandrelopez.fr.
2. **Regarder les logs d'accès Vercel** sur `/api/market/*` et
   `/api/leads/list` depuis le 17/06. S'il y a eu des accès depuis des IP
   inconnues, la question d'une violation de données personnelles se pose.
3. **`/studio` et `/resultats/[token]` ne sont pas dans `robots.txt`.** Le
   disallow couvre `/admin`, `/app`, `/dashboard`, `/espace-client`. Le Sanity
   Studio est donc crawlable ; les pages de résultat sont protégées par un jeton
   non devinable, ce qui est plus défendable.
4. **Envisager un garde par défaut** plutôt que route par route. Le schéma
   actuel est « ouvert sauf mention contraire » : c'est ce qui a produit cette
   situation, et la prochaine route ajoutée repartira ouverte.
