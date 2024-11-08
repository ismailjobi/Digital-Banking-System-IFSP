import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeModule } from './Employee/employee.module';
import { AuthModule } from './Authentication/auth.module';
import { adminAuthModule } from './Administrator/Auth/adminAuth.module';
import { AdminModule } from './Administrator/admin.module';
import { UserModule } from './User/user.module';

@Module({
  imports: [
    EmployeeModule,
    AdminModule ,
    UserModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Tiger',
      database: 'DBH',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,adminAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
