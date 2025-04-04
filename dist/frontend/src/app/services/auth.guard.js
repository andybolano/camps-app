"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const auth_service_1 = require("./auth.service");
const authGuard = () => {
    const authService = (0, core_1.inject)(auth_service_1.AuthService);
    const router = (0, core_1.inject)(router_1.Router);
    if (authService.isAuthenticated()) {
        return true;
    }
    router.navigate(['/login']);
    return false;
};
exports.authGuard = authGuard;
//# sourceMappingURL=auth.guard.js.map