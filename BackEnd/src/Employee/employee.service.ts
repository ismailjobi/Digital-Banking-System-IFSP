import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { EmployeeDTO, profileDTO } from "./DTO/employee.dto";
import { loginDTO } from "../DTO/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./Entity/Account.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { EmailService } from "src/Mailer/mailer.service";
import { Users } from "src/CommonEntities/user.entity";
import { Authentication } from "src/Authentication/Entity/auth.entity";
import { Transactions } from "./Entity/transaction.entity";
import { AdminService } from "src/Administrator/admin.service";

@Injectable()
export class EmployeeService {
  [x: string]: any;
  constructor(@InjectRepository(Users) private employeeRepo: Repository<Users>,
    @InjectRepository(Authentication) private autheRepo: Repository<Authentication>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    private adminService: AdminService,
    private jwtService: JwtService,
    private emailService: EmailService

  ) { }

  getUsers(): object {
    return { message: "hellow Admin" }
  }

  async findOne(logindata: loginDTO): Promise<any> {
    try {
      return await this.autheRepo.findOne({ where: { Email: logindata.email }, relations: ['User', 'Role'] });
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while finding user.");
    }
  }

  async createAccount(myobj: EmployeeDTO): Promise<EmployeeDTO | string> {
    try {
      const employeeRegistration = new Users();
      employeeRegistration.userId = employeeRegistration.generateId();
      employeeRegistration.fullName = myobj.name;
      employeeRegistration.gender = myobj.gender;
      employeeRegistration.dob = myobj.dob;
      employeeRegistration.nid = myobj.nid;
      employeeRegistration.phone = myobj.phone;
      employeeRegistration.address = myobj.address;
      employeeRegistration.filename = myobj.employeeFilename;

      employeeRegistration.Authentication = new Authentication();
      employeeRegistration.Authentication.Email = myobj.email;
      employeeRegistration.Authentication.Password = myobj.password;
      employeeRegistration.Authentication.roleId = await this.adminService.getRoleIdByName(myobj.role);
      employeeRegistration.Authentication.Active = true;



      const account = new AccountEntity();
      account.userId = employeeRegistration; // Assuming userId in AccountEntity is of type employeeRegistrationEntity
      account.name = myobj.nomineeName;
      account.gender = myobj.nomineeGender;
      account.dob = myobj.nomineedob;
      account.nid = myobj.nomineenNid;
      account.phone = myobj.nomineephone;
      account.address = myobj.nomineeAddress;
      account.accountNumber = account.generateAccountNumber();
      account.filename = myobj.nomineeFilename;
      account.accountType = myobj.accountType;

      console.log('Checking if NID exists...');
      const existNID = await this.employeeRepo.findOneBy({ nid: myobj.nid });
      if (existNID) {
        return "This NID already exists";
      }
      console.log('Checking if Email exists...');
      const existEmail = await this.autheRepo.findOneBy({ Email: myobj.email });
      if (existEmail) {
        return "This Email already exists";
      }
      const existNomineeNid = await this.accountRepo.findOneBy({ nid: myobj.nomineenNid });
      if (existNomineeNid) {
        return "This NID already exists";
      }
      console.log('Checking ...');
      if (!existNID && !existEmail && !existNomineeNid) {
        await this.autheRepo.save(employeeRegistration.Authentication);
        await this.employeeRepo.save(employeeRegistration);
        await this.accountRepo.save(account);
      }

      // const loginTime = new Date();
      // const subject = "Welcome to IFSP BANK PLC";
      // const body = "Your Account has been created at : " + loginTime;

      // await this.emailService.sendMail(myobj.email, subject, body);

      return myobj;
    } catch (error) {
      // Here We Handle The Error 
      //return "An error occurred during account creation.";
      throw new Error("An error occurred during account creation.: " + error);
    }
  }

  async getAccountInfo(): Promise<Authentication[] | string> {
    try {
      const accounts = await this.autheRepo.find({ where: { roleId: await this.adminService.getRoleIdByName("accountant") }, relations: ['User'] });
      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('There Is No Account Found');
      }

      return accounts;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while fetching account information.");
    }
  }

  async updateEmployee(userId: string, myobj: EmployeeDTO): Promise<Users | string> {
    try {
      // Find the existing employee by userId with associated entities
      const account = await this.employeeRep.findOne({
        where: { userId: userId },
        relations: ['Authentication', 'Accounts']
      });

      if (!account) {
        throw new NotFoundException('Account not found');
      }

      // Check restricted fields
      if (account.Authentication.Email !== myobj.email) {
        throw new ForbiddenException("Email cannot be changed by account officer");
      }

      if (account.nid !== myobj.nid) {
        throw new ForbiddenException("NID cannot be changed by account officer");
      }

      if (account.Accounts.accountNumber !== myobj.accountNumber) {
        throw new ForbiddenException("Account Number cannot be changed by account officer");
      }

      // Updating allowed fields only
      account.fullName = myobj.name;
      account.gender = myobj.gender;
      account.dob = myobj.dob;
      account.phone = myobj.phone;
      account.address = myobj.address;
      account.filename = myobj.employeeFilename;

      // Only update specific fields in the Authentication entity
      account.Authentication.Password = myobj.password || account.Authentication.Password;
      account.Authentication.Active = myobj.isActive;

      // Update only allowed fields in AccountEntity
      account.Accounts.name = myobj.nomineeName;
      account.Accounts.gender = myobj.nomineeGender;
      account.Accounts.dob = myobj.nomineedob;
      account.Accounts.phone = myobj.nomineephone;
      account.Accounts.address = myobj.nomineeAddress;
      account.Accounts.accountType = myobj.accountType;

      // Save updates to repositories
      await this.autheRepo.save(account.Authentication);
      await this.employeeRepo.save(account);
      await this.accountRepo.save(account.Accounts);

      // Retrieve the updated account information with relations
      const updatedInfo = await this.employeeRep.findOne({
        where: { userId: userId },
        relations: ['Authentication', 'Accounts']
      });

      return updatedInfo;
    } catch (error) {
      // Handle any errors
      throw new Error(`Error occurred while updating employee: ${error.message}`);
    }
  }

}