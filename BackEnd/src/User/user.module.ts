import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../Authentication/auth.service';
import { AuthController } from '../Authentication/auth.controller';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { EmployeeService } from 'src/Employee/employee.service';
import { jwtConstants } from 'src/Authentication/constants';
import { EmailService } from 'src/Mailer/mailer.service';
import { Users } from 'src/CommonEntities/user.entity';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Transactions } from 'src/Employee/Entity/transaction.entity';
import { AdminModule } from 'src/Administrator/admin.module';
import { FormerEmployee } from 'src/Employee/Entity/formeremployee.entity';

@Module({
  imports: [
    AdminModule,
    TypeOrmModule.forFeature([
      Users,
      Authentication,
      AccountEntity,
      Transactions,
      ServiceEntity,
      ,
      FormerEmployee
    ]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    
  ],
 controllers: [UserController,AuthController],
 providers:[ UserService,AuthService,EmployeeService,EmailService],
 exports: [UserService],
})
export class UserModule {}


