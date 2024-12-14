// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { jwtConstants } from 'src/Authentication/constants';
// import { AuthController } from 'src/Authentication/auth.controller';
// import { UserService } from 'src/User/user.service';
// import { OtpController } from './otp.controller';
// import { OtpService } from './otp.service';
// import { EmailService } from 'src/Mailer/mailer.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { Transactions } from 'src/Employee/Entity/transaction.entity';
// import { Users } from 'src/CommonEntities/user.entity';
// import { OTPs } from 'src/CommonEntities/Otp.entity';
// import { Authentication } from 'src/Authentication/Entity/auth.entity';
// import { AccountEntity } from 'src/Employee/Entity/Account.entity';
// import { ServiceEntity } from 'src/Employee/Entity/service.entity';
// import { FormerEmployee } from 'src/Employee/Entity/formeremployee.entity';
// import { UserModule } from 'src/User/user.module';



// @Module({
//   imports: [
  
    
//     TypeOrmModule.forFeature([
//        Users,
//       Authentication,
//       AccountEntity,
//       Transactions,
//       ServiceEntity,
//       OTPs,
//       FormerEmployee
    
//     ]),
  
    
//   ],
//  controllers: [OtpController,AuthController],
//  providers:[ OtpService,UserService,EmailService],
//  exports: [OtpService],
// })
// export class OtpModule {}


