import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
export declare class AuthController {
    private authService;
    private usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            username: any;
            role: any;
        };
    }>;
    register(createUserDto: CreateUserDto): Promise<import("../users/entities/user.entity").User>;
    getProfile(req: any): any;
}
