import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: join(process.cwd(), 'db.sqlite'),
      entities: [join(__dirname, '../../**/*.entity{.ts,.js}')],
      synchronize: true, // Set to false in production
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
