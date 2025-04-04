import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private usersRepository;
    private readonly logger;
    constructor(usersRepository: Repository<User>);
    private initDefaultAdmin;
    create(createUserDto: CreateUserDto): Promise<User>;
    findOne(id: number): Promise<User>;
    findByUsername(username: string): Promise<User | undefined>;
}
