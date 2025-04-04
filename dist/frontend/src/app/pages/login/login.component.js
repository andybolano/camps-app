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
exports.LoginComponent = void 0;
const core_1 = require("@angular/core");
const common_1 = require("@angular/common");
const forms_1 = require("@angular/forms");
const router_1 = require("@angular/router");
const auth_service_1 = require("../../services/auth.service");
let LoginComponent = class LoginComponent {
    constructor(fb, authService, router) {
        this.fb = fb;
        this.authService = authService;
        this.router = router;
        this.isLoading = false;
        this.errorMessage = '';
        this.loginForm = this.fb.group({
            username: ['', [forms_1.Validators.required]],
            password: ['', [forms_1.Validators.required]],
        });
        if (this.authService.isAuthenticated()) {
            this.router.navigate(['/camps']);
        }
    }
    get username() {
        return this.loginForm.get('username');
    }
    get password() {
        return this.loginForm.get('password');
    }
    onSubmit() {
        if (this.loginForm.invalid) {
            return;
        }
        this.isLoading = true;
        this.errorMessage = '';
        const { username, password } = this.loginForm.value;
        this.authService.login(username, password).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/camps']);
            },
            error: (error) => {
                this.isLoading = false;
                this.errorMessage = error.message;
            },
        });
    }
};
exports.LoginComponent = LoginComponent;
exports.LoginComponent = LoginComponent = __decorate([
    (0, core_1.Component)({
        selector: 'app-login',
        standalone: true,
        imports: [common_1.CommonModule, forms_1.ReactiveFormsModule],
        templateUrl: './login.component.html',
        styleUrl: './login.component.scss',
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        auth_service_1.AuthService,
        router_1.Router])
], LoginComponent);
//# sourceMappingURL=login.component.js.map