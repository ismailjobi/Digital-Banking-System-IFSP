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
import { FormerEmployee } from "./Entity/formeremployee.entity";
import { changePasswordDTO } from "./DTO/changepassword.dto";
import * as Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateNomineeDto } from "./DTO/nomineeupdate.dto";
import { generateAccountActivation} from "src/Templates/accountactivation";
import { generateAccountDeactivation } from "src/Templates/accountdeactivation";

@Injectable()
export class EmployeeService {
  [x: string]: any;
  constructor(@InjectRepository(Users) private employeeRepo: Repository<Users>,
    @InjectRepository(Authentication) private autheRepo: Repository<Authentication>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    @InjectRepository(FormerEmployee) private formerEmployeeRepo: Repository<FormerEmployee>,
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
      // Check if phone number already exists for another user
      if (myobj.phone) {
        const existingPhone = await this.employeeRepo.findOne({ where: { phone: myobj.phone } });
        if (existingPhone && existingPhone.userId !== employeeRegistration.userId) {
          throw new BadRequestException('This phone number is already associated with another account.');
        }
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

      // Check if phone number already exists for another user
      if (myobj.phone) {
        const existingPhone = await this.employeeRepo.findOne({ where: { phone: myobj.phone } });
        if (existingPhone && existingPhone.userId !== account.userId) {
          throw new BadRequestException('This phone number is already associated with another account.');
        }
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

  async updateEmployeeNominee(accountNumber: number, myobj: UpdateNomineeDto): Promise<AccountEntity | string> {
    try {
      console.log('Account Number:', accountNumber);
      console.log('Nominee Data:', myobj);

      // Find the existing account
      const account = await this.accountRepo.findOne({ where: { accountNumber: accountNumber } });

      if (!account) {
        throw new BadRequestException('Account not found');
      }

      // Validate restricted fields - ensure the NID cannot be changed
      if (account.nid && account.nid !== myobj.nomineenNid) {
        throw new BadRequestException('NID cannot be changed');
      }

      // Update allowed fields
      account.nomineeName = myobj.nomineeName || account.nomineeName;
      account.nomineeGender = myobj.nomineeGender || account.nomineeGender;
      account.nomineeDob = myobj.nomineedob || account.nomineeDob;
      account.nomineeAddress = myobj.nomineeAddress || account.nomineeAddress;
      account.nomineeName = myobj.nomineeFilename || account.filename;

      // Save the updated account information
      await this.accountRepo.save(account);

      return account;
    } catch (error) {
      throw new Error(`Error updating nominee information: ${error.message}`);
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

  async deleteEmployee(userId: string): Promise<void | string> {
    // Find the account and associated authentication details
    const account = await this.employeeRepo.findOne({ where: { userId }, relations: ['Authentication'] });
    if (!account) {
      throw new NotFoundException('Account not found');
    }

    try {
      // Check if the user is an admin by comparing role IDs
      const adminRoleId = await this.adminService.getRoleIdByName("admin");
      if (adminRoleId !== null && account.Authentication.roleId !== adminRoleId) {
        console.log("Hello");
        // Create a new FormerEmployee record
        const formerEmployee = new FormerEmployee();
        formerEmployee.userId = account.userId;
        formerEmployee.fullName = account.fullName;
        formerEmployee.gender = account.gender;
        formerEmployee.dob = account.dob;
        formerEmployee.nid = account.nid;
        formerEmployee.phone = account.phone;
        formerEmployee.address = account.address;
        formerEmployee.filename = account.filename;
        formerEmployee.departureDate = new Date(); // Set current date as departure date
        formerEmployee.formerRole = account.Authentication.roleId;

        // Update original Authentication role to "user"
        const userRoleId = await this.adminService.getRoleIdByName("user");

        if (userRoleId && account.Authentication.roleId !== userRoleId) {
          account.Authentication.roleId = userRoleId;
          try {
            await this.autheRepo.save(account.Authentication);  // Save updated role
            // Save the former employee record
            await this.formerEmployeeRepo.save(formerEmployee);
            return `Account of employee ${userId} transferred to user account`;
          } catch (error) {
            console.error("Failed to save Authentication:", error.message);
            throw new Error("Failed to save the updated Authentication role");
          }
        } else {
          return `Account of employee ${userId} please check role again.`;
        }

      } else {
        return `Admin account of employee ${userId} cannot be transferred to user account`;
      }
    } catch (error) {
      console.error("Failed to save Autentication:", error.message);
      throw new Error('Error occurred while attempting to transfer account.');
    }
  }

  async getProfile(userEmail: string): Promise<Authentication | string> {
    try {
      const account = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });

      if (!account) {
        throw new NotFoundException('User not found');
      }
      delete account.Password;  // Remove the password
      return account;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while getting user profile.");
    }
  }

  async updateProfile(userEmail: string, profileDto: profileDTO): Promise<Authentication | string> {
    try {
      // Find the user and their authentication details
      const user = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });
      console.log(profileDto);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Update allowed fields
      user.User.fullName = profileDto.name || user.User.fullName;
      user.User.gender = profileDto.gender || user.User.gender;
      user.User.dob = profileDto.dob ? new Date(Date.parse(profileDto.dob)) : user.User.dob;
      user.User.phone = profileDto.phone || user.User.phone;
      user.User.address = profileDto.address || user.User.address;

      // Check if NID update is attempted
      if (profileDto.nid && profileDto.nid !== user.User.nid) {
        throw new BadRequestException('National ID (NID) cannot be changed directly. Please contact support.');
      }

      // Check if email update is attempted
      if (profileDto.email && profileDto.email !== user.Email) {
        throw new BadRequestException('Email cannot be changed.');
      }

      // Handle optional profile image update
      if (profileDto.filename && profileDto.filename !== user.User.filename) {
        user.User.filename = profileDto.filename;
      }

      // Check if phone number already exists for another user
      if (profileDto.phone) {
        const existingPhone = await this.employeeRepo.findOne({ where: { phone: profileDto.phone } });
        if (existingPhone && existingPhone.userId !== user.User.userId) {
          throw new BadRequestException('This phone number is already associated with another account.');
        }
      }

      // Save the updated user details
      await this.employeeRepo.save(user.User);

      // Fetch and return the updated user details
      const updatedUser = await this.autheRepo.findOne({ where: { Email: userEmail }, relations: ['User'] });
      delete updatedUser.Password;  // Remove the password
      return updatedUser;
    } catch (error) {
      // Log the error for debugging
      console.error('Error updating profile:', error);

      // Throw a generic error to the client
      throw new Error('An error occurred while updating the profile. Please try again.');
    }
  }

  async passwordChange(userEmail: string, myobj: changePasswordDTO): Promise<string> {
    try {
      // Check if the user exists
      const account = await this.autheRepo.findOne({ where: { Email: userEmail } });
      if (!account) {
        throw new NotFoundException('User not found');
      }
      // Compare the current password with the stored password
      const isMatch = await bcrypt.compare(myobj.currentPassword, account.Password);
      console.log(isMatch);
      console.log(myobj);
      if (!isMatch) {
        return 'Current password is incorrect';
      }

      // Check if new password and confirm password match
      if (myobj.newPassword !== myobj.confirmPassword) {
        return 'New password and confirm password do not match';
      }

      // Salt and hash the new password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(myobj.newPassword, salt);

      // Update the password in the database
      account.Password = hashedPassword;
      await this.autheRepo.save(account);

      return 'Password successfully changed.';
    } catch (error) {
      // For unexpected errors, throw a general error
      throw new Error('An unexpected error occurred while changing the password.');
    }
  }

  async getInactiveemployeeAccount(): Promise<string | any[]> {
    try {
      const userRoleId = await this.adminService.getRoleIdByName("accountant");
      const accounts = await this.autheRepo.find({ where: { roleId: userRoleId, Active: false }, relations: ['User'] });

      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('No inactive user accounts found');
      }

      return accounts;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while getting inactive user accounts.");
    }
  }

  async getInactiveUserAccount(): Promise<string | any[]> {
    try {
      const userRoleId = await this.adminService.getRoleIdByName("user");
      const accounts = await this.autheRepo.find({ where: { roleId: userRoleId, Active: false }, relations: ['User'] });

      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('No inactive user accounts found');
      }

      return accounts;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while getting inactive user accounts.");
    }
  }

  async activateUserAccount(userId: string): Promise<string> {
    try {
      const account = await this.employeeRepo.findOne({
        where: { userId },
        relations: ['Authentication', 'Accounts'],
      });

      if (!account) {
        throw new NotFoundException('No account found for the given user ID');
      }

      // Mark the account active
      account.Authentication.Active = true;

      // Map the Accounts array to match the expected structure for the Handlebars template
      const mappedAccounts = account.Accounts.map((acc) => ({
        AccountNumber: `${acc.accountNumber.toString().slice(0, 2)}****${acc.accountNumber
          .toString()
          .slice(-2)}`,
        AccountType: acc.accountType,
        Balance: `$${acc.balance.toFixed(2)}`,
      }));

      // Generate the HTML content for the email using the mapped data
      const emailContent = generateAccountActivation(account.fullName, mappedAccounts);

      // Send the email with raw HTML
      await this.emailService.sendMail(
        account.Authentication.Email,
        'Account Activation Notification',
        emailContent, // Pass the raw HTML
      );

      // Update the database
      await this.autheRepo.save(account.Authentication);

      return "UserID: " + userId + " is now active.";
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while activating user account." + error);
    }
  }

  async deactivateUserAccount(userId: string): Promise<string> {
    try {
      const account = await this.employeeRepo.findOne({
        where: { userId },
        relations: ['Authentication', 'Accounts'],
      });

      if (!account) {
        throw new NotFoundException('No account found for the given user ID');
      }

      // Mark the account inactive
      account.Authentication.Active = false;

      // Map the Accounts array to match the expected structure for the Handlebars template
      const mappedAccounts = account.Accounts.map((acc) => ({
        AccountNumber: `${acc.accountNumber.toString().slice(0, 2)}****${acc.accountNumber
          .toString()
          .slice(-2)}`,
        AccountType: acc.accountType,
        Balance: `$${acc.balance.toFixed(2)}`,
      }));

      // Generate the HTML content for the email using the mapped data
      const emailContent = generateAccountDeactivation(account.fullName, mappedAccounts);

      // Send the email with raw HTML
      await this.emailService.sendMail(
        account.Authentication.Email,
        'Account Deactivation Notification',
        emailContent, // Pass the raw HTML
      );

      // Update the database
      await this.autheRepo.save(account.Authentication);

      return `UserID: ${userId} is now deactivated.`;
    } catch (error) {
      throw new Error(error.message || 'Error occurred while deactivating user account.');
    }
  }

  async getUserAccountInfo(): Promise<string | any[]> {
    try {
      const subString = "U-";
      const accounts = await this.employeeRepo.find({ where: { userId: Like(subString + '%') }, relations: ['Authentication', 'Accounts'] });

      if (!accounts || accounts.length === 0) {
        throw new NotFoundException('No user accounts found');
      }

      // Remove Password from Authentication for each account
      accounts.forEach((account) => {
        if (account.Authentication) {
          delete account.Authentication.Password;
        }
      });
      return accounts;
    } catch (error) {
      // Here We Handle The Error 
      throw new Error("Error occurred while getting user account information.");
    }
  }



}