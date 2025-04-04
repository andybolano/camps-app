"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authInterceptor = void 0;
const core_1 = require("@angular/core");
const auth_service_1 = require("./auth.service");
const authInterceptor = (req, next) => {
    const authService = (0, core_1.inject)(auth_service_1.AuthService);
    const token = authService.getToken();
    if (token) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
    return next(req);
};
exports.authInterceptor = authInterceptor;
//# sourceMappingURL=auth.interceptor.js.map