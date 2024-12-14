import { Injectable, NotFoundException, Patch, Req, UnauthorizedException, ValidationPipe } from '@nestjs/common';
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
import { OTPs } from 'src/CommonEntities/Otp.entity';
import * as bcrypt from 'bcrypt';
import { OtpService } from 'src/Verification/otp.service';
// import { OtpService } from 'src/Verification/otp.service';



@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
    private adminService :AdminService,
    private jwtService: JwtService,
    private emailService:EmailService,
     private otpService:OtpService,
    @InjectRepository(Authentication) private authRepository: Repository<Authentication>, 
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>, 
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>,
    @InjectRepository(OTPs) private otpRepository: Repository<OTPs>,
  ) {}

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



 
async deposit(myobj: transactionDto,email:string): Promise<{balance: number, transaction: Transactions}> {

  const userID = await this.getUserIdByEmail(email);
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);

  if (isNaN(myobj.amount)) { 
    throw new Error('Amount is not a valid number');
  }
   console.log("Id from Service"+userID);
    
  const acInfo = await this.getAccountInfo(userID);
  console.log("ACINFO"+acInfo);

   acInfo.forEach((account) => {
    if (account.accountType == myobj.accountType) {
      myobj.accountNumber = account.accountNumber;}
  }
  );
  console.log(myobj.accountNumber);

  await this.emailService.sendMail(email, "Hi", "msg");


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
  await this.transactionRepo.save(transaction);
 
  return {
    balance: user.balance,
    transaction: transaction
  };
}

// Transfer Money


async transfer(myobj: transactionDto,email:string): Promise<{transaction: Transactions}> {
  console.log("Attempting to insert/update database with account number:", myobj.accountNumber);
  console.log("Withdraw amount:", myobj.amount);


  if (isNaN(myobj.amount)) {
    throw new Error('Amount is not a valid number');
  }

  const id = await this.getUserIdByEmail(email);
  
  if(id){
  
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
  transaction.transactionId = transaction.generateId(); // Make sure this method exists and correctly generates an ID.
 
  myobj.amount>500000?transaction.transactionStatus = false:transaction.transactionStatus = true;
  transaction.accountType = myobj.accountType;
  transaction.accountNumber = myobj.accountNumber;
  transaction.amount = myobj.amount;
  transaction.bankCode = myobj.bankCode;
  transaction.receiverName = myobj.receiverName;
  transaction.receiverAccount = myobj.receiverAccount;
  transaction.routingNumber = myobj.routingNumber;
  transaction.transferType = myobj.transferType;
  

  // user.balance -= myobj.amount;
  transaction.userId = user.userId;

    const {otp}  = await this.otpService.generateOtp();

    const lastFourDigits = myobj.accountNumber.toString().slice(-4);
  
  const msgBody = "Dear Accountholder, \n  Do not share the One Time Password (OTP) with anyone. Use OTP: "+ otp +" for transaction of BDT "+ myobj.amount + " using Account Number# **"+ lastFourDigits +". This OTP is valid for next 2 minutes. \n If this transaction is not performed by you, please immediately contact our 24-hour Call Center at 0202. If you are residing outside Bangladesh, then please call +880255668056 (from abroad). \n Sincerely,\n IFSP Bank PLC.";  
  const msg = msgBody + otp;
  
  const subject = "IFSP Bank E-commerce transaction OTP (One Time Password)";

 // await this.emailService.sendMail(email, subject, msg);
  console.log("User ID From OTP Session"+id);

  console.log("OTP"+otp); 
  console.log("Here is my email " + email); 
  await this.emailService.sendMail(email, subject, msgBody);
 

  const salt = await bcrypt.genSalt();
  const hashedOtp=await bcrypt.hash(otp, salt);


  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

  const otpEntity = new OTPs();
  otpEntity.otp = hashedOtp;
  otpEntity.createdAt = createdAt;
  otpEntity.expiredAt = expiresAt;
 // otpEntity.transactions = transaction;
  otpEntity.userId = user.userId;
   otpEntity.transactions = transaction;
  
   console.log("Transaction ID"+transaction.transactionId);
  // await this.otpRepository.save({
  //   hashedOtp,
  //     createdAt,
  //     expiresAt,
  //     transaction.transactionId,
  //     Users.userId
   

  // });
  

  
  await this.accountRepository.save(user);
  await this.transactionRepo.save(transaction);
  await this.otpRepository.save(otpEntity);
 
  return {
    transaction: transaction
  };
}
else{
  throw new UnauthorizedException('User not found');
}
}


async validateTransfer(id: string, otp: string): Promise<{ msg: string }> {

  const TransId = await this.getTransactionId(id);
  
console.log("Transaction ID"+TransId);
console.log("OTP"+id);
  const transaction = await this.transactionRepo.findOne({ where: { transactionId: TransId.toString() } });
  if (!transaction) {
    throw new NotFoundException('Transaction not found');
  }

  const otpEntity = await this.otpRepository.findOne({ 
    where: { transactions: { transactionId: TransId.toString() } }, 
    relations: ['transactions'] 
});
console.log("Validation Check " + otpEntity.createdAt);
  if (!otpEntity) {
    throw new NotFoundException('OTP not found');
  }

  const isValid = await bcrypt.compare(otp, otpEntity.otp);
  if (!isValid) {
    throw new UnauthorizedException('Invalid OTP');
  }
  if(new Date() > otpEntity.expiredAt){
    throw new UnauthorizedException('Otp Expired');

  }

  transaction.verification = true;
  await this.transactionRepo.save(transaction);
  await this.otpRepository.remove(otpEntity);

  return {
    msg: 'Transaction completed successfully'
  };
}



///--6  transection One to many

async getUserInfoAndTransactions(id: number): Promise<{ transactions: Transactions[] }> {
  
  //const user = await this.userRepository.findOne({ where: { userId: id } });
  
  const transactions = await this.transactionRepo.find( { where: { accountNumber : id },
    relations: ['userId'],
  });

  
  return {  transactions };
}

async getUserIdByEmail(email: string): Promise<string> {
  const user = await this.authRepository.findOne({ where: { Email: email } , relations: ["User"]});
  if (!user) {
    throw new NotFoundException('User not found');
  }
  return user.User.userId;

}



async getTransactionId(UserId:string):Promise<{ }>{
  console.log("User ID From Session hello "+UserId);
  if(!UserId){
    throw new NotFoundException('User not found');
  }
  const transactionId = await this.userRepository.findOne({
    where: { userId: UserId },
    relations: ["Transactions"],
    order: {
      Transactions: {
        applicationTime: "DESC", // Assuming 'createdAt' is the timestamp field in Transactions
      },
    },
  });
  
  if(!transactionId){
    throw new NotFoundException('Transaction not found');
    const a = transactionId.Transactions[0].transactionId;
  }
  return transactionId.Transactions[0].transactionId;
}

  // async sendOtp(otp: string ,email :string , subject : string, msgBody: string, transactionId : string  ):Promise<{msg: string}>{
    
        
  //       //console.log("User ID From Session"+req.userId);
     
  //       const msg = msgBody + otp;

  //       const userId = await this.userService.getUserIdByEmail(email);

  //       console.log("User ID From OTP Session"+userId);

  //       // await this.emailService.sendMail(email, subject, msg);

  //       const salt = await bcrypt.genSalt();
  //       const hashedpassword = await bcrypt.hash(otp, salt);
  //       otp = hashedpassword;

  //       const createdAt = new Date();
  //       const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

  //       await this.otpRepository.save({
  //           otp,
  //           createdAt,
  //           expiresAt,
  //           transactionId,
  //           Users.userId
         

  //       });
  //       // Send OTP to email
  //       return {
  //           msg: 'OTP sent successfully'
  //       };
  //   }

}
