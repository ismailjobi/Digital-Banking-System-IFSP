import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from "@nestjs/typeorm";
import { adminSignup } from './DTOs/AdminSignup.dto';
import { AdminDetails } from './DTOs/AdminDetails.dto';
import { submitOtp } from './DTOs/submitOtp.dto';
import { adminAuthService } from './Auth/adminAuth.service';
import { UpdateAdminDetails } from './DTOs/UpdateAdminDetails.dto';
import { UpdateAdminEmail } from './DTOs/UpdateAdminEmail.dto';
import { ForgetAdminPassword } from './DTOs/ForgetAdminPassword.dto';
import { AllocateSalary } from './DTOs/AllocateSalary.dto';
import { salarySheetGen } from './DTOs/salarySheetGen.dto';
import { LoginSessions } from 'src/CommonEntities/LoginSessions.entity';
import { Transactions } from 'src/Employee/Entity/transaction.entity';
import { Role } from './Entity/Role.entity';
import { BaseSalary } from './Entity/BaseSalary.entity';
import { AttendanceReports } from './Entity/AttendanceReports.entity';
import { SalarySheet } from './Entity/SalarySheet.entity';
import { ProductKeys } from './Entity/ProductKeys.entity';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Users } from 'src/CommonEntities/user.entity';
import { AdminOTP } from './Entity/AdminOTP.entity';

@Module({
  imports: [adminSignup, AdminDetails,UpdateAdminDetails,UpdateAdminEmail,salarySheetGen,AllocateSalary, ForgetAdminPassword, submitOtp, TypeOrmModule.forFeature([Role, BaseSalary, AttendanceReports, SalarySheet, ProductKeys, Authentication, Users, AdminOTP, LoginSessions, Transactions]),
    // JwtModule.register({
    //   global: true,
    //   secret: "3NP_Backend_Admin",
    //   signOptions: { expiresIn: '30m' },
    // }),
  ],
  controllers: [AdminController],
  providers: [AdminService, adminAuthService],
  exports: [AdminService],
})
export class AdminModule { }
