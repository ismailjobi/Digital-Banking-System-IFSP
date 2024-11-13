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
import { EmployeeUpdateDTO } from "./DTO/employeeupdate.dto";

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
      const accounts = await this.autheRepo.find({
        where: { roleId: await this.adminService.getRoleIdByName("accountant") },
        relations: ['User', 'User.Accounts']
      });
      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('There Is No Account Found');
      }

      return accounts;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while fetching account information.");
    }
  }

  async updateEmployee(userId: string, myobj: EmployeeUpdateDTO): Promise<Users | string> {
    try {
      console.log(userId);
      console.log(myobj);

      // Find the existing employee by userId with associated entities
      const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
      console.log(account);
      if (!account) {
        return 'Account not found';
      }

      // Check restricted fields
      if (myobj.email !== null && account.Authentication.Email !== myobj.email) {
        return "Email cannot be changed by account officer";
      }

      if (myobj.nid !== null && account.nid !== myobj.nid) {
        return "NID cannot be changed by account officer";
      }

      // Updating allowed fields only
      account.fullName = myobj.name || account.fullName;
      account.gender = myobj.gender || account.gender;
      account.dob = myobj.dob || account.dob;
      account.phone = myobj.phone || account.phone;
      account.address = myobj.address || account.address;
      account.filename = myobj.employeeFilename || account.filename;

      // Only update specific fields in the Authentication entity
      account.Authentication.Password = account.Authentication.Password;
      account.Authentication.Active = myobj.isActive ?? account.Authentication.Active;

      // Save updates to repositories
      await this.autheRepo.save(account.Authentication);
      await this.employeeRepo.save(account);

      // Retrieve the updated account information with relations, excluding the password
      const updatedInfo = await this.employeeRepo.findOne({
        where: { userId: userId },
        relations: ['Authentication'],
      });

      if (updatedInfo) {
        delete updatedInfo.Authentication.Password;  // Remove the password
      }

      return updatedInfo;
    } catch (error) {
      throw new Error(`Error occurred while updating employee: ${error.message}`);
    }
  }


  async getAccountInfoById(userId: string): Promise<Users | string> {
    try {
      const account = await this.employeeRepo.findOne({ where: { userId: userId }, relations: ['Authentication'] });
      const roleId = account.Authentication.roleId;
      const dbRoleId = await this.adminService.getRoleIdByName("admin");
      if (!account || roleId == dbRoleId) {
        throw new NotFoundException('There Is No Account Found');
      }
      if (roleId != dbRoleId) {
        return account;
      }
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while fetching account information.");
    }
  }

  async deleteEmployee(userId: string): Promise<void|string> {
    // Find the account and associated authentication details
    const account = await this.employeeRepo.findOne({ where: { userId }, relations: ['Authentication'] });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    try {
      // Check if the user is an admin by comparing role IDs
      console.log(account.Authentication.roleId);
      const adminRoleId = await this.adminService.getRoleIdByName("admin");
      console.log(adminRoleId);
      if (adminRoleId !== null && account.Authentication.roleId !== adminRoleId) {
        // If not an admin, set account to inactive
        account.Authentication.Active = false;
        console.log('authRepo:', account.Authentication); // Ensure this outputs a valid object
        await this.autheRepo.save(account.Authentication);  // Save deactivation to the database
        console.log(`Account for user ${userId} set to inactive`);
        return`Account for user ${userId} set to inactive`;
      } else {
        console.log(`Admin account for user ${userId} is not deactivated`);
        return `Admin account for user ${userId} is not deactivated`;
      }
    } catch (error) {
      // Log and propagate the error
      console.error('Error occurred while deleting user:', error);
      throw new Error('Error occurred while attempting to deactivate or delete account.');
    }
  }

}