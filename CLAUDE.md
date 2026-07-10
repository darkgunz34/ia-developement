# Helpdesk — CLAUDE.md

Front-end Angular d'une application **Helpdesk Kanban** reconstruite à partir d'une maquette HTML fournie par Claude.

## Structure du dépôt

```
Helpdesk/
├── Helpdesk Kanban (claude design).html   # maquette source (bundlée)
├── run-dev.cmd                            # lance le dev server sur :4200
└── helpdesk-front/                        # app Angular
    └── src/app/
        ├── app.ts / app.html / app.scss / app.config.ts / app.routes.ts
        ├── models/ticket.models.ts        # Ticket, PriorityKey, StatusKey, PRIORITIES, STATUSES, PEOPLE, STATUS_ORDER, PRIORITY_ORDER, personOf()
        ├── data/mock-tickets.ts           # jeu de données offline
        ├── services/
        │   ├── ticket-api.service.ts      # seam HttpClient (renvoie du mock pour l'instant)
        │   └── ticket-store.ts            # signal store — source de vérité de tout l'état
        └── components/
            ├── toolbar/                   # recherche, filtres, toggle Kanban/Table, compteurs
            ├── kanban-board/               ├── kanban-column/    ├── ticket-card/
            ├── table-view/                # vue tableau triable
            ├── detail-drawer/             # panneau latéral (édition statut/priorité, SLA, activité, commentaire)
            └── avatar/ · priority-badge/ · status-pill/         # atomes
```

## Stack et conventions

- **Angular 22** (zoneless, signals, standalone components), **TypeScript ~6**, **SCSS**.
- Tous les composants sont `standalone` avec `changeDetection: OnPush`.
- Templates : **inline** dans le `@Component` par défaut ; passage à `templateUrl` uniquement si le template devient trop long. Idem pour les styles (inline `styles:` sauf pour `app.scss` et `detail-drawer.scss` qui ont leur fichier).
- **Signals partout** : `signal()`, `computed()`, `.update()`. Pas de `BehaviorSubject`, pas de `NgRx`.
- **`TicketStore`** (`@Injectable({ providedIn: 'root' })`) porte tout l'état UI (view, search, filtres, sélection, drag, tri) + la liste de tickets. Les composants sont "bêtes" et lisent uniquement des `computed` du store.
- **`TicketApiService`** injecte déjà `HttpClient` et expose `list()` / `update()` avec des signatures REST. Aujourd'hui elles renvoient du mock via `of(...)` ; brancher un vrai backend = remplacer le corps par `this.http.get/patch`, rien d'autre à toucher.
- Mise à jour optimiste : `TicketStore.patch()` met à jour le signal local puis appelle l'API.
- Pas de gestion d'erreur artificielle ni de fallback tant qu'il n'y a pas de vrai backend.

## Lancer le projet

Node.js est installé dans `C:\Program Files\nodejs\` mais **n'est pas dans le PATH** des shells. Deux options :

1. **`run-dev.cmd`** à la racine — ajoute node au PATH et lance `npm start -- --port 4200 --host 127.0.0.1`.
2. Manuellement (PowerShell), préfixer chaque commande :
   ```powershell
   $env:Path = "C:\Program Files\nodejs;" + $env:Path
   npm start   # ou: npm run build, npx ng generate ...
   ```

Le shell ne persiste pas entre les tool calls — ré-appliquer le PATH à chaque fois.

## Écrire du code dans ce projet

- Suivre le pattern des composants existants : `standalone` + `OnPush` + `inject()` (pas de `constructor(private ...)`).
- Utiliser la nouvelle syntaxe de flux (`@for`, `@if`, `@switch`) plutôt que `*ngFor`/`*ngIf`.
- Ajouter un état UI ? → un `signal` dans `TicketStore`, pas dans le composant.
- Ajouter une donnée dérivée ? → un `computed` dans `TicketStore`.
- Ajouter un endpoint ? → une méthode sur `TicketApiService` avec la vraie signature REST, puis le brancher dans le store.
- Le modèle domaine (`ticket.models.ts`) est la source unique pour priorités, statuts, personnes et ordres — ne pas dupliquer ces constantes ailleurs.
- Reproduire fidèlement la maquette (couleurs, layout, comportements). La maquette originale est le fichier HTML à la racine ; ses styles inline doivent être traduits en SCSS par composant.

## À éviter

- Ne pas réintroduire de zone.js ni de `NgModule`.
- Ne pas ajouter de gestionnaire de state externe (NgRx, Akita…) — signals suffisent.
- Pas d'abstractions préventives : trois lignes similaires valent mieux qu'un helper prématuré.
- Pas de commentaires qui répètent le nom du symbole ; en écrire un uniquement quand le *pourquoi* n'est pas évident.
