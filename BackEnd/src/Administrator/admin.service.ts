import { ConsoleLogger, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, IsNull, MoreThan, Repository } from 'typeorm';
import { Role } from './Entity/Role.entity';
import { SalarySheet } from './Entity/SalarySheet.entity';
import { ProductKeys } from './Entity/ProductKeys.entity';
import { BaseSalary } from './Entity/BaseSalary.entity';
import { AttendanceReports } from './Entity/AttendanceReports.entity';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Users } from 'src/CommonEntities/user.entity';
import { AdminOTP } from './Entity/AdminOTP.entity';
import { LoginSessions } from 'src/CommonEntities/LoginSessions.entity';
import { Transactions } from 'src/Employee/Entity/transaction.entity';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Role) private roleRepository: Repository<Role>,
        @InjectRepository(SalarySheet) private salarySheetRepository: Repository<SalarySheet>,
        @InjectRepository(ProductKeys) private productKeysRepository: Repository<ProductKeys>,
        @InjectRepository(BaseSalary) private baseSalaryRepository: Repository<BaseSalary>,
        @InjectRepository(AttendanceReports) private attendanceReportsRepository: Repository<AttendanceReports>,
        @InjectRepository(Authentication) private authenticationRepository: Repository<Authentication>,
        @InjectRepository(Users) private usersRepository: Repository<Users>,
        @InjectRepository(AdminOTP) private adminOTPRepository: Repository<AdminOTP>,
        @InjectRepository(LoginSessions) private loginSessionsRepository: Repository<LoginSessions>,
        @InjectRepository(Transactions) private transactionRepository: Repository<Transactions>,
        private jwtService: JwtService
    ) { }

    getUsers(): object {
        return { message: "hellow Admin" }
    }

    async getRoleIdByName(name: string): Promise<string> {
        let exData = await this.roleRepository.find({
            where: { Name: name.toLowerCase() }
        });
        if (exData.length > 0) {
            return exData[0].Id;
        }
        return null;
    }

    async findVerifiedAdminByEmailForAuth(email: string): Promise<Authentication | null> {
        try {
            // console.log(email);
            let exData = await this.authenticationRepository.find({
                where: { Email: email, RoleID: await this.getRoleIdByName("admin"), Active: true }
            });
            // console.log(exData);
            if (exData.length == 0) {
                return null; //Admin not found
            }
            return exData[0];
        }
        catch (error) {
            // console.log(error);
            return null;
        }
    }
    async saveLoginData(email: string, token: string): Promise<boolean> {
        try {
            const data = new LoginSessions();
            data.Email = email;
            data.Token = token;
            let cData = await this.loginSessionsRepository.save(data);
            return cData != null; //success
        } catch (error) {
            console.error('Error while Saving Login Data =>', error);
            return false;
        }
    }
    async checkValidLoginTokenData(email: string, token: string): Promise<boolean> {
        try {
            let data = await this.loginSessionsRepository.find({
                where: { Email: email, Token: token, deletedAt: IsNull() }
            });
            return data.length != 0;
        } catch (error) {
            console.error('Error while finding Login Data =>', error);
            return false;
        }
    }
}
