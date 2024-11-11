import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { EmailService } from 'src/Mailer/mailer.service';
import { Users } from 'src/CommonEntities/user.entity';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Transactions } from 'src/Employee/Entity/transaction.entity';
import { RegistrationUserDto } from './UserDTO/user.dto';
import { AdminService } from 'src/Administrator/admin.service';


@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
    private adminService :AdminService,
    private jwtService: JwtService,
    private emailService:EmailService,
    @InjectRepository(Authentication) private authRepository: Repository<Authentication>, 
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(Transactions) private tansactionRepository: Repository<Transactions>, 
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>) {}

    getUser():string{
        return"hello";
    }

    async addAccount(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
        const userRegistration = new Users();
        userRegistration.userId = userRegistration.generateUserId();
        userRegistration.fullName = myobj.name;
        userRegistration.gender = myobj.gender;
        userRegistration.dob = myobj.dob;
        userRegistration.nid= myobj.nid;
        userRegistration.phone = myobj.phone;
        userRegistration.address = myobj.address;
        userRegistration.filename = myobj.filename;
    
        userRegistration.Authentication = new Authentication();
        userRegistration.Authentication.Email = myobj.email;
        userRegistration.Authentication.Password = myobj.password;
        userRegistration.Authentication.roleId = await this.adminService.getRoleIdByName("user");
        userRegistration.Authentication.Active = true;
    
    
    
        const account = new AccountEntity();
        account.userId = userRegistration; // Assuming userId in AccountEntity is of type UserRegistrationEntity
        account.name = myobj.nomineeName;
        account.gender = myobj.nomineeGender;
        account.dob = myobj.nomineedob;
        account.nid = myobj.nomineenNid;
        account.phone = myobj.nomineephone;
        account.address = myobj.nomineeAddress;
        account.accountNumber = account.generateAccountNumber();
        account.filename = myobj.nomineeFilename;
        account.accountType = myobj.accountType;
    
        const existNID = await this.userRepository.findOneBy({ nid: userRegistration.nid });
        if (existNID) {
          return "This NID already exists";
        }
        const existEmail = await this.authRepository.findOneBy({ Email: userRegistration.Authentication.Email });
        if (existEmail) {
          return "This Email already exists";
        }
    
        await this.authRepository.save(userRegistration.Authentication);
        await this.userRepository.save(userRegistration);
        await this.accountRepository.save(account);
    
        // const loginTime = new Date();
        // const subject = "Welcome to IFSP BANK PLC";
        // const body = "Your Account has been created at : " + loginTime;
    
        // await this.emailService.sendMail(myobj.email, subject, body);
    
        return myobj;
    
      }

}


