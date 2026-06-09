# Suivi Projet - Mandat OS MVP

## Informations Generales
- Nom du projet: Mandat OS MVP - Site Alexandre Lopez (Provence Verte & Verdon)
- Client: Alexandre Lopez (conseiller immobilier iad)
- Date de debut: 09 juin 2026
- Date cible MVP: 30 juin 2026
- Statut global: En cours

## Liens Importants
- Linear: https://linear.app/alexandre-lopez/project/mandat-os-mvp-site-alexandre-lopez-af1414ac70da
- GitHub: https://github.com/alexlopez-studio/site-alex-lopez-provence
- Supabase: https://byrsmbgfkvgxdtdyhrro.supabase.co
- Vercel: https://vercel.com/alexlopez-studio/site-alex-lopez-provence

## Avancement par Lot

### Lot 1 - Infrastructure
- Statut: Termine
- Deadline: 01/06/2026

### Lot 2 - API Backend
- Statut: En cours (0%)
- Deadline: 15/06/2026
- Taches:
  - ALE-29: API-001 - CRUD Regles
  - ALE-30: API-002 - Notifications
  - ALE-31: API-003 - Opportunites
  - ALE-28: API-004 - Zones Surveillees

### Lot 3 - UI Dashboard
- Statut: Non commence (0%)
- Deadline: 20/06/2026
- Taches:
  - ALE-35: UI-001 - Dashboard KPIs
  - ALE-33: UI-002 - Table Marche
  - ALE-34: UI-003 - Fiche Bien
  - ALE-32: UI-004 - Kanban Opportunites
  - ALE-36: UI-005 - Gestion Regles

### Lot 4 - Moteur de Regles
- Statut: Non commence (0%)
- Deadline: 25/06/2026
- Taches:
  - ALE-39: RUL-001 - Assistant Creation Regle
  - ALE-38: RUL-002 - Execution Manuelle
  - ALE-37: RUL-003 - Regles Preconfigurees

### Lot 5 - Monitoring
- Statut: Non commence (0%)
- Deadline: 30/06/2026
- Taches:
  - ALE-40: MON-001 - Dashboard Consommation API

## Dependances entre Lots
Lot 2 (API Backend) -> Lot 3 (UI Dashboard)
Lot 2 -> Lot 4 (Moteur de Regles)
Lot 3 -> Lot 4
Lot 4 -> Lot 5 (Monitoring)

## Prochaines Etapes
1. Demarrer le Lot 2 (API Backend) - priorite immediate
2. Valider chaque API avec Alexandre avant de passer a l UI
3. Verifier les webhooks Vercel -> GitHub

## Journal de Bord

### 09/06/2026
- Redaction du Cahier des Charges
- Creation du projet Linear
- Creation de tous les labels (16 labels)
- Creation de toutes les issues Linear (13 issues)

### A faire
- Configurer GitHub Projects avec tableau Kanban
- Verifier les integrations Linear <-> GitHub
- Creer le fichier supabase/seed.sql
- Demarrer le developpement du Lot 2

## Commandes Work Utiles
Creer une issue: Work, cree une issue Linear pour [tache] avec description [texte], assigne a @alexlopez, priorite [urgent/high/medium], labels [lot-2, backend], due date [15/06/2026].

Mettre a jour une issue: Work, passe l issue API-001 en In Progress dans Linear.

Lier une PR: Work, lie la PR #123 a l issue API-001 dans Linear.

Rapport d avancement: Work, donne-moi un rapport d avancement du Lot 2.

Deployment: Work, declenche un deployment Vercel pour la branche preview.

## Metriques
- Total issues: 13
- Issues terminees: 0
- Issues en cours: 0
- Issues a faire: 13
- Progression globale: 0%

---
Derniere mise a jour: 09/06/2026
Maintenu par: Work (IA) avec Mistral
