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
import { transactionDto } from './UserDTO/user.transaction.dto';


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
        userRegistration.filename = myobj.UserFileName;
    
        userRegistration.Authentication = new Authentication();
        userRegistration.Authentication.Email = myobj.email;
        userRegistration.Authentication.Password = myobj.password;
        userRegistration.Authentication.roleId = await this.adminService.getRoleIdByName("user");
        userRegistration.Authentication.Active = true;
    
    
    
        const account = new AccountEntity();
        account.userId = userRegistration; // Assuming userId in AccountEntity is of type UserRegistrationEntity
        account.name = myobj.nomineeName;
        account.gender = myobj.nomineeGender;
        account.dob = myobj.nomineeDob;
        account.nid = myobj.nomineeNid;
        account.phone = myobj.nomineePhone;
        account.address = myobj.nomineeAddress;
        account.accountNumber = account.generateAccountNumber();
        account.filename = myobj.nomineeFileName;
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
    
        const loginTime = new Date();
        const subject = "Welcome to IFSP BANK PLC";
        const body = "Your Account has been created at : " + loginTime;
    
        await this.emailService.sendMail(myobj.email, subject, body);
    
        return myobj;
    
      }

      //Get User Profile Picture

      async getUserProfilePictureById(userId: string): Promise<{ name: string; fileName: string }> {
        const user = await this.userRepository.findOne({ select: { filename: true , fullName: true }, where: { userId: userId } });
        if (!user || !user.filename) {
           throw new NotFoundException('User profile picture not found');
        }
        return { name: user.fullName, fileName: user.filename };
      
      }
      
//Get User Profile
async getProfile(id:string):Promise<Users[]>{
  // return this.userRepository.find({select:{name:true,gender:true},
  // where:[{userId:id}]})
   return this.userRepository.find({ where: {userId: id}});
 }

// Geting Account Info Using User ID
 async getAccountInfo(id: string): Promise<AccountEntity[]> {
  // Await the result of the userRepository find() method
  const acInfo = await this.userRepository.find({
    where: { userId: id },
    relations: ['Accounts'],
  });
  console.log(acInfo);

  // Initialize an array to hold the account information
  const acInfoReturn: AccountEntity[] = [];

// Loop through the accounts and push them to the return array

    acInfo[0].Accounts.forEach((account) => {
      const accountEntity = new AccountEntity();
      accountEntity.accountNumber = account.accountNumber;
      accountEntity.name = account.name;
      accountEntity.accountType = account.accountType;

      // Push the account entity to the return array
      acInfoReturn.push(accountEntity);
    }); 

  // Return the array of AccountEntity
  return acInfoReturn;
}



 
async deposit(myobj: transactionDto,id:string): Promise<{balance: number, transaction: Transactions}> {
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);

  if (isNaN(myobj.amount)) { 
    throw new Error('Amount is not a valid number');
  }
   console.log("Id from Service"+id);
    
  const acInfo = await this.getAccountInfo(id);
  console.log("ACINFO"+acInfo);

   acInfo.forEach((account) => {
    if (account.accountType == myobj.accountType) {
      myobj.accountNumber = account.accountNumber;}
  }
  );
  console.log(myobj.accountNumber);



const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
}); 


 
  if (!user) {
    throw new NotFoundException('User not found');
  }

  // Ensure sufficient balance
  if( myobj.amount<0){
    throw new Error('Enter a valid amount: ' + user.balance);
  }

  // Prepare transaction entity
  const transaction = new Transactions();
  transaction.transactionId = transaction.generateId(); // Make sure this method exists and correctly generates an ID.
  transaction.transactionStatus = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.accountNumber = myobj.accountNumber;
  transaction.amount = myobj.amount;
  transaction.bankCode = myobj.bankCode;
  transaction.receiverAccount = myobj.receiverAccount;
  transaction.receiverName = myobj.receiverName;
  transaction.routingNumber = myobj.routingNumber;
  transaction.transferType = myobj.transferType;

  

   user.balance += Number(myobj.amount);
  transaction.userId = user.userId;
  console.log(user.gender);
  console.log(transaction.userId);
  console.log(user.userId);

  

  
  await this.accountRepository.save(user);
  await this.tansactionRepository.save(transaction);
 
  return {
    balance: user.balance,
    transaction: transaction
  };
}

// Transfer Money


async transfer(myobj: transactionDto,id:string): Promise<{balance: number, transaction: Transactions}> {
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);

  if (isNaN(myobj.amount)) {
    throw new Error('Amount is not a valid number');
  }

  
  const acInfo = await this.getAccountInfo(id);
  console.log("ACINFO"+acInfo);

   acInfo.forEach((account) => {
    if (account.accountType == myobj.accountType) {
      myobj.accountNumber = account.accountNumber;}
  }
  );
  console.log(myobj.accountNumber);


  const user = await this.accountRepository.findOne({ where: { accountNumber: myobj.accountNumber }, relations: ['userId'],
}); 

 
  if (!user) {
    throw new NotFoundException('User not found');
  }
  console.log(user);

  // Ensure sufficient balance
  if(user.balance < myobj.amount){
    throw new NotFoundException('Insufficient balance for withdrawal. Current balance is: ' + user.balance);
  }

  // Prepare transaction entity
  const transaction = new Transactions();
 // transaction.transactionId = Transaction.generateId(); // Make sure this method exists and correctly generates an ID.
  transaction.transactionStatus = myobj.Status;
  transaction.accountType = myobj.accountType;
  transaction.accountNumber = myobj.accountNumber;
  transaction.amount = myobj.amount;
  transaction.bankCode = myobj.bankCode;
  transaction.receiverName = myobj.receiverName;
  transaction.receiverAccount = myobj.receiverAccount;
  transaction.routingNumber = myobj.routingNumber;
  transaction.transferType = myobj.transferType;

  user.balance -= myobj.amount;
  transaction.userId = user.userId;
  

  
  await this.accountRepository.save(user);
  await this.tansactionRepository.save(transaction);
 
  return {
    balance: user.balance,
    transaction: transaction
  };
}

///--6  transection One to many

async getUserInfoAndTransactions(id: number): Promise<{ transactions: Transactions[] }> {
  
  //const user = await this.userRepository.findOne({ where: { userId: id } });
  
  const transactions = await this.tansactionRepository.find( { where: { accountNumber : id },
    relations: ['userId'],
  });

  
  return {  transactions };
}




}


