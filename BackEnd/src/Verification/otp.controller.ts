// import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
// import { OtpService } from "./otp.service";
// import { AuthGuard } from "src/Authentication/auth.guard";
// import { OtpDto } from "./VerificationDTO/otp.dto";


// @Controller('/api/otp')
// export class OtpController {
//     constructor(private readonly otpService:OtpService) { }


//     @UseGuards(AuthGuard)
//     @Get('generateOtp')
//     async generateOtp(): Promise<{otp:string}>  {
//         return this.otpService.generateOtp();
//     }

    
//     // @Post('sendOtp')
//     // async sendOtp(email :string , subject : string, msgBody: string, transactionId : string): Promise<{msg: string}>{
//     //     const {otp} = await this.generateOtp();
//     //     return this.otpService.sendOtp(otp,email,subject,msgBody,transactionId);
//     // }

//     @Post("sendOtp")
//     async sendOtp(
//         @Body() myobj: OtpDto 
//     ): Promise<{ msg: string }> {
//       const { otp } = await this.generateOtp();
//       return this.otpService.sendOtp(myobj.email, myobj.subject, myobj.msgBody, myobj.transactionId);
//     }
    
// }