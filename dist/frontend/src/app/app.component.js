"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const common_1 = require("@angular/common");
const auth_service_1 = require("./services/auth.service");
let AppComponent = class AppComponent {
    constructor(authService, router) {
        this.authService = authService;
        this.router = router;
        this.title = 'frontend';
        this.isLoggedIn = false;
        this.authSubscription = null;
        this.isLoggedIn = this.authService.isAuthenticated();
    }
    ngOnInit() {
        this.authSubscription = this.authService.currentUser$.subscribe((user) => {
            this.isLoggedIn = !!user;
            if (!this.isLoggedIn && !this.router.url.includes('/login')) {
                this.router.navigate(['/login']);
            }
        });
    }
    ngOnDestroy() {
        if (this.authSubscription) {
            this.authSubscription.unsubscribe();
        }
    }
    logout(event) {
        event.preventDefault();
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
exports.AppComponent = AppComponent;
exports.AppComponent = AppComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-root',
        standalone: true,
        imports: [router_1.RouterOutlet, router_1.RouterLink, router_1.RouterLinkActive, common_1.CommonModule],
        templateUrl: './app.component.html',
        styleUrl: './app.component.scss',
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        router_1.Router])
], AppComponent);
//# sourceMappingURL=app.component.js.map