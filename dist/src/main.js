"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const path_1 = require("path");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api');
    const isDev = process.env.NODE_ENV !== 'production';
    if (isDev) {
        app.enableCors({
            origin: 'http://localhost:4200',
            credentials: true,
        });
    }
    else {
        app.enableCors();
    }
    if (!isDev) {
        app.useStaticAssets((0, path_1.join)(__dirname, '..', '..', 'frontend/dist/frontend/browser'));
        app.use('*', (req, res, next) => {
            if (req.originalUrl.startsWith('/api')) {
                next();
            }
            else {
                res.sendFile((0, path_1.join)(__dirname, '..', '..', 'frontend/dist/frontend/browser/index.html'));
            }
        });
    }
    await app.listen(3000);
    console.log(`Application running on: ${await app.getUrl()}`);
    console.log(`Environment: ${isDev ? 'development' : 'production'}`);
}
bootstrap();
//# sourceMappingURL=main.js.map