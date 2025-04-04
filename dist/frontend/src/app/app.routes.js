"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const auth_guard_1 = require("./services/auth.guard");
exports.routes = [
    {
        path: 'login',
        loadComponent: () => Promise.resolve().then(() => require('./pages/login/login.component')).then((c) => c.LoginComponent),
    },
    {
        path: 'camps',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/camps/camps.component')).then((c) => c.CampsComponent),
    },
    {
        path: 'camps/new',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/camp-form/camp-form.component')).then((c) => c.CampFormComponent),
    },
    {
        path: 'camps/:id/edit',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/camp-form/camp-form.component')).then((c) => c.CampFormComponent),
    },
    {
        path: 'camps/:campId/clubs',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/clubs/clubs.component')).then((c) => c.ClubsComponent),
    },
    {
        path: 'camps/:campId/clubs/new',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/club-form/club-form.component')).then((c) => c.ClubFormComponent),
    },
    {
        path: 'camps/:campId/clubs/:id/edit',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/club-form/club-form.component')).then((c) => c.ClubFormComponent),
    },
    {
        path: 'camps/:campId/events',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/events/events.component')).then((c) => c.EventsComponent),
    },
    {
        path: 'camps/:campId/events/new',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/event-form/event-form.component')).then((c) => c.EventFormComponent),
    },
    {
        path: 'camps/:campId/events/:id/edit',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/event-form/event-form.component')).then((c) => c.EventFormComponent),
    },
    {
        path: 'camps/:campId/events/:eventId/score',
        canActivate: [auth_guard_1.authGuard],
        loadComponent: () => Promise.resolve().then(() => require('./pages/event-scoring/event-scoring.component')).then((c) => c.EventScoringComponent),
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' },
];
//# sourceMappingURL=app.routes.js.map