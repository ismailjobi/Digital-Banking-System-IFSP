
import { randomInt } from 'crypto';

export class OtpService {
  //   constructor(@InjectRepository(OTPs) private otpRepository: Repository<OTPs>,
  //   @InjectRepository(Users) private userRepository: Repository<Users>,
  //   @InjectRepository(Transactions) private transactionRepository: Repository<Transactions>,
  //   private emailService:EmailService ,
  
  //    private userService:UserService,
  // private jwtService: JwtService){}


    async generateOtp(): Promise<{otp:string}>  {
        const otp = randomInt(100000, 999999).toString(); // 6-digit OTP
        // const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
        return {otp};
    }

    // async sendOtp(otp: string ,email :string , subject : string, msgBody: string, transactionId : string  ):Promise<{msg: string}>{
    
        
    //     //console.log("User ID From Session"+req.userId);
     
    //     const msg = msgBody + otp;

    //     const userId = await this.userService.getUserIdByEmail(email);

    //     console.log("User ID From OTP Session"+userId);

    //     // await this.emailService.sendMail(email, subject, msg);

    //     const salt = await bcrypt.genSalt();
    //     const hashedpassword = await bcrypt.hash(otp, salt);
    //     otp = hashedpassword;

    //     const createdAt = new Date();
    //     const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

    //     await this.otpRepository.save({
    //         otp,
    //         createdAt,
    //         expiresAt,
    //         transactionId,
    //         Users.userId
         

    //     });
    //     // Send OTP to email
    //     return {
    //         msg: 'OTP sent successfully'
    //     };
    // }


      
      
}
