import { Module } from "@nestjs/common";
import {EmployeeController} from "./employee.controller";
import { EmployeeService } from "./employee.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthService } from "../Authentication/auth.service";
import { AccountEntity } from "./Entity/Account.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { jwtConstants } from "src/Authentication/constants";
import { JwtModule } from "@nestjs/jwt";
import { EmailService } from "src/Mailer/mailer.service";
import { UserService } from "src/User/user.service";
import { Users } from "src/CommonEntities/user.entity";
import { Authentication } from "src/Authentication/Entity/auth.entity";
import { Transactions } from "./Entity/transaction.entity";
import { AdminModule } from "src/Administrator/admin.module";
import { FormerEmployee } from "./Entity/formeremployee.entity";
import { OTPs } from "src/CommonEntities/Otp.entity";
import { OtpService } from "src/Verification/otp.service";




@Module({
    imports: [AdminModule,TypeOrmModule.forFeature([Users,Authentication,AccountEntity,Transactions,ServiceEntity,FormerEmployee,OTPs]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60m' },
    }),
    
  ],
    controllers:[EmployeeController],
    providers: [EmployeeService,AuthService,EmailService,UserService,OtpService],
    exports: [EmployeeService],
  })
  export class EmployeeModule {}