"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const router_1 = require("@angular/router");
const app_routes_1 = require("./app.routes");
const http_1 = require("@angular/common/http");
const animations_1 = require("@angular/platform-browser/animations");
const auth_interceptor_1 = require("./services/auth.interceptor");
exports.appConfig = {
    providers: [
        (0, router_1.provideRouter)(app_routes_1.routes, (0, router_1.withHashLocation)()),
        (0, http_1.provideHttpClient)((0, http_1.withInterceptors)([auth_interceptor_1.authInterceptor])),
        (0, animations_1.provideAnimations)(),
    ],
};
//# sourceMappingURL=app.config.js.map