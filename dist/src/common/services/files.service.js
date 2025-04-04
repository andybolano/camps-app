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
var FilesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const fs = require("fs");
let FilesService = FilesService_1 = class FilesService {
    constructor() {
        this.logger = new common_1.Logger(FilesService_1.name);
        this.uploadsDir = (0, path_1.join)(process.cwd(), 'uploads');
        if (!(0, fs_1.existsSync)(this.uploadsDir)) {
            (0, fs_1.mkdirSync)(this.uploadsDir, { recursive: true });
            this.logger.log(`Directorio de uploads creado: ${this.uploadsDir}`);
        }
    }
    async saveFile(file, subFolder = '') {
        try {
            const targetDir = subFolder
                ? (0, path_1.join)(this.uploadsDir, subFolder)
                : this.uploadsDir;
            if (!(0, fs_1.existsSync)(targetDir)) {
                (0, fs_1.mkdirSync)(targetDir, { recursive: true });
            }
            const timestamp = new Date().getTime();
            const fileNameWithoutExt = file.originalname.split('.')[0];
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${fileNameWithoutExt}-${timestamp}.${fileExt}`;
            const filePath = (0, path_1.join)(targetDir, fileName);
            fs.writeFileSync(filePath, file.buffer);
            const relativePath = subFolder
                ? `uploads/${subFolder}/${fileName}`
                : `uploads/${fileName}`;
            this.logger.log(`Archivo guardado: ${relativePath}`);
            return relativePath;
        }
        catch (error) {
            this.logger.error(`Error al guardar archivo: ${error.message}`);
            throw error;
        }
    }
    async deleteFile(filePath) {
        try {
            const absolutePath = (0, path_1.join)(process.cwd(), filePath);
            if ((0, fs_1.existsSync)(absolutePath)) {
                fs.unlinkSync(absolutePath);
                this.logger.log(`Archivo eliminado: ${filePath}`);
            }
            else {
                this.logger.warn(`Archivo no encontrado: ${filePath}`);
            }
        }
        catch (error) {
            this.logger.error(`Error al eliminar archivo: ${error.message}`);
            throw error;
        }
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = FilesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], FilesService);
//# sourceMappingURL=files.service.js.map