import { Module } from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { EmployeeEntity } from "./Entity/employee.entity";
import { AuthService } from "../Authentication/auth.service";
import { AccountEntity } from "./Entity/Account.entity";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { jwtConstants } from "src/Authentication/constants";
import { JwtModule } from "@nestjs/jwt";
import { EmailService } from "src/Mailer/mailer.service";
import { AuthenticationEntity } from "src/Authentication/Entity/auth.entity";
import { UserService } from "src/User/user.service";



@Module({
    imports: [TypeOrmModule.forFeature([EmployeeEntity,AuthenticationEntity,AccountEntity,TransactionEntity,ServiceEntity],),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    
  ],
    controllers:[EmployeeController],
    providers: [EmployeeService,AuthService,EmailService,UserService],
    exports: [EmployeeService],
  })
  export class EmployeeModule {}