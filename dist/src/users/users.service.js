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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
let UsersService = UsersService_1 = class UsersService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
        this.logger = new common_1.Logger(UsersService_1.name);
        this.initDefaultAdmin();
    }
    async initDefaultAdmin() {
        try {
            const adminExists = await this.findByUsername('admin');
            if (!adminExists) {
                this.logger.log('Creating default admin user...');
                const hashedPassword = await bcrypt.hash('qaz123', 10);
                const adminUser = this.usersRepository.create({
                    username: 'admin',
                    password: hashedPassword,
                    role: 'admin',
                });
                await this.usersRepository.save(adminUser);
                this.logger.log('Default admin user created successfully');
            }
            else {
                this.logger.log('Admin user already exists');
            }
        }
        catch (error) {
            this.logger.error('Failed to create default admin user', error);
        }
    }
    async create(createUserDto) {
        const { username, password, role } = createUserDto;
        const existingUser = await this.usersRepository.findOne({
            where: { username },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Username already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            username,
            password: hashedPassword,
            role: role || 'user',
        });
        return this.usersRepository.save(user);
    }
    async findOne(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map