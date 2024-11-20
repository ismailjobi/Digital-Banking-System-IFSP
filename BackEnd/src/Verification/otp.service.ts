// import { Injectable, Req } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { randomInt } from 'crypto';
// import { OTPs } from 'src/CommonEntities/Otp.entity';
// import { EmailService } from 'src/Mailer/mailer.service';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcrypt';

// @Injectable()
// export class OtpService {
//     constructor(@InjectRepository(OTPs) private otpRepository: Repository<OTPs>,
//     private emailService:EmailService ,
//   private jwtService: JwtService){}


//     async generateOtp(): Promise<{otp:string}>  {
//         const otp = randomInt(100000, 999999).toString(); // 6-digit OTP
//         // const expiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
//         return {otp};
//     }

//     async sendOtp(otp: string , userID:string,subject : string, msgBody: string ,@Req() req: any ):Promise<{msg: string}>{

        
//         console.log("User ID From Session"+req.userId);
//         const email = req.email;
//         const msg = msgBody + otp;

//         await this.emailService.sendMail(email, subject, msg);

//         const salt = await bcrypt.genSalt();
//         const hashedpassword = await bcrypt.hash(otp, salt);
//         otp = hashedpassword;

//         const createdAt = new Date();
//         const expiresAt = new Date(createdAt.getTime() + 2 * 60 * 1000); // 2 minutes

//         await this.otpRepository.save({
//             otp,
//             email,
//             createdAt,
//             expiresAt,
//             userId
//         });
//         // Send OTP to email
//         return {
//             msg: 'OTP sent successfully'
//         };
//     }
// }
