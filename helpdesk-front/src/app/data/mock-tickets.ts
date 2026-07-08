import { Ticket } from '../models/ticket.models';

/**
 * Seed data used until a real backend is wired in.
 * `TicketApiService.list()` returns a clone of this array.
 */
export const MOCK_TICKETS: Ticket[] = [
  { id: 1042, title: 'Erreur 500 au login SSO', priority: 'urgente', status: 'ouvert', category: 'Auth', assignee: 'SN', created: '05/07', sla: 'SLA dépassé', overdue: true, desc: 'Les utilisateurs SSO reçoivent une 500 après redirection Okta. Reproduit en production depuis le déploiement 3.14.' },
  { id: 1051, title: 'Webhook Stripe non reçu', priority: 'urgente', status: 'ouvert', category: 'API', assignee: 'YB', created: '06/07', sla: '6 h restantes', desc: 'Les webhooks payment_intent.succeeded ne sont plus reçus depuis 09h. Vérifier la signature et le endpoint de callback.' },
  { id: 1049, title: 'Rate limiting trop strict', priority: 'moyenne', status: 'ouvert', category: 'API', assignee: 'MP', created: '06/07', sla: '2 j restants', desc: "Les intégrations partenaires atteignent la limite de 100 req/min. Demande d'augmentation à 300 req/min." },
  { id: 1047, title: "Crash mobile à l'ouverture d'une pièce jointe", priority: 'haute', status: 'ouvert', category: 'Bug', assignee: 'YB', created: '05/07', sla: '1 j restant', desc: "L'app mobile crashe à l'ouverture d'une pièce jointe PDF supérieure à 10 Mo sur Android." },
  { id: 1033, title: 'Endpoint API manquant dans la doc', priority: 'basse', status: 'ouvert', category: 'Doc', assignee: null, created: '03/07', sla: '3 j restants', desc: "L'endpoint DELETE /users/{id} n'est pas documenté dans le portail développeur." },
  { id: 1052, title: 'Typo sur la page facturation', priority: 'basse', status: 'ouvert', category: 'UI', assignee: 'LF', created: '06/07', sla: '5 j restants', desc: "« Facturaton » au lieu de « Facturation » dans l'en-tête du récapitulatif." },

  { id: 1038, title: 'Latence API /orders supérieure à 3s', priority: 'haute', status: 'en_cours', category: 'Perf', assignee: 'MP', created: '04/07', sla: '2 h restantes', desc: 'Le p95 de /orders dépasse 3s aux heures de pointe. Piste privilégiée : requête N+1 sur les lignes de commande.' },
  { id: 1019, title: 'Fuite mémoire sur le worker cron', priority: 'haute', status: 'en_cours', category: 'Infra', assignee: 'TG', created: '01/07', sla: '4 h restantes', desc: 'Le worker de nettoyage consomme +2 Go/jour. Suspicion de listeners non détachés après traitement.' },
  { id: 1041, title: 'Code 2FA par SMS non délivré', priority: 'haute', status: 'en_cours', category: 'Auth', assignee: 'SN', created: '04/07', sla: '8 h restantes', desc: "Les codes SMS 2FA n'arrivent pas pour les numéros +33. Provider Twilio à vérifier côté routage." },
  { id: 1045, title: 'Bouton export CSV grisé', priority: 'moyenne', status: 'en_cours', category: 'UI', assignee: 'LF', created: '05/07', sla: '1 j restant', desc: "Le bouton d'export reste désactivé quand aucune ligne n'est sélectionnée, alors qu'il devrait exporter tout." },

  { id: 1008, title: 'Certificat TLS staging bientôt expiré', priority: 'urgente', status: 'en_attente', category: 'Infra', assignee: 'TG', created: '30/06', sla: 'En attente ops', desc: "Le certificat *.staging expire le 08/07. Renouvellement Let's Encrypt à automatiser via cert-manager." },
  { id: 1027, title: 'Migration base v12 → v15 échoue', priority: 'haute', status: 'en_attente', category: 'Base de données', assignee: 'CR', created: '02/07', sla: 'En attente client', desc: "La migration Postgres 12→15 échoue sur la contrainte fk_orders_user. En attente d'une fenêtre de maintenance." },
  { id: 1030, title: "Améliorer le message d'erreur d'upload", priority: 'basse', status: 'en_attente', category: 'UI', assignee: null, created: '02/07', sla: 'En attente design', desc: "Le message « erreur » est trop générique. Proposer un libellé spécifique par type d'échec." },

  { id: 1015, title: 'Refonte de la pagination de la liste', priority: 'basse', status: 'ferme', category: 'UI', assignee: 'CR', created: '28/06', sla: 'Résolu', done: true, desc: 'Remplacement de la pagination par un scroll infini sur la liste des tickets. Livré en 3.13.' },
  { id: 1003, title: 'Index manquant sur la table logs', priority: 'moyenne', status: 'ferme', category: 'Base de données', assignee: 'MP', created: '25/06', sla: 'Résolu', done: true, desc: "Ajout d'un index sur logs.created_at pour accélérer les requêtes d'audit." },
  { id: 1024, title: 'Dashboard métriques vides après fuseau', priority: 'moyenne', status: 'ferme', category: 'Perf', assignee: 'TG', created: '24/06', sla: 'Résolu', done: true, desc: 'Le dashboard affichait 0 après changement de fuseau horaire. Corrigé côté agrégation.' },
];
