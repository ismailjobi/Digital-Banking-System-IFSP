import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Req, Res, Session, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from "./user.service";
import { Roles } from 'src/CustomDecorator/roles.decorator';
import { AuthGuard } from 'src/Authentication/auth.guard';
import { transactionDto } from './UserDTO/user.transaction.dto';
import { Transactions } from 'src/Employee/Entity/transaction.entity';
import { ValidationDto } from 'src/Verification/VerificationDTO/otp.dto';
import { Role } from 'src/Administrator/Entity/Role.entity';

@Controller('/api/user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  // @UseGuards(AuthGuard)

  @Get()
  getUser(): string {
    return this.userService.getUser();
  }

  //Get Profile Picture
  @UseGuards(AuthGuard)
  @Roles('user')
  @Get('profile-picture/:userId')
  async getUserProfilePictureById(@Param('userId') userId: string, @Res() res, @Session() session) {
    const profilePicture = (await this.userService.getUserProfilePictureById(userId)).fileName;
    const name = (await this.userService.getUserProfilePictureById(userId)).name;

    res.sendFile(profilePicture, { root: './upload' });
  }

   //--2 user account Info
  @UseGuards(AuthGuard)
  @Roles('user')
  @Get('/getProfileInfo')
  getUserProfile(@Body() body: any) {
    
    console.log("Session"+body.userId);

    if (body.userId) {
      // Retrieve data from session
     // const userId = session['userId']; // Access the 'email' property stored in the session
      console.log("User ID From Session"+body.userId);
      return this.userService.getProfile(body.userId);
    }
    throw new NotFoundException('No data in BODY');

  }

  
  //--4 deposit Money completed (This feauture is working But Here is some conceptual issue)
   @UseGuards(AuthGuard)
  @Roles('user')
  @Patch('/deposit')
  @UsePipes(new ValidationPipe())
  async deposit(@Body() myobj: transactionDto , @Req() req: any ): Promise<{ balance: number, transaction: Transactions }> {
    {
      try {
          
       // console.log("User ID From Session"+req.role);
       // console.log("User ID From Session"+req.user?.userId);
   
        const userEmail = req.user?.email; // Access the 'email' property stored in the session
       
        return await this.userService.deposit(myobj,req.email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw error;
      }
    }
  }

  //--5 Tranfer Money . Initially Varification Will be false. after submitting Otp Transaction will be completed
  @Roles('user')
  @Patch('/transfer')
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async transer(@Body() myobj: transactionDto , @Req() req): Promise<{transaction: Transactions }> {
    {
      try {

 
        return await this.userService.transfer(myobj,req.user.email);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw error;
        }
        throw error;
      }
    }
  }

  //validate Transfer
  @Roles('user')
  @Patch('/validateTransfer')
  @UseGuards(AuthGuard)

  async validateTransfer(@Body() myobj : ValidationDto,@Req() req): Promise<{msg: string }> {

    return await this.userService.validateTransfer(req.user?.userId,myobj.otp);
   

  }


 // @UseGuards(AuthGuard)
  // @Roles('user')
  // @Get('/getAccountInfo')
  // getUserAccountInfo(@Body() body: any) {
    
  //   console.log("Session"+body.userId);

  //   if (body.userId) {
  //     // Retrieve data from session
  //    // const userId = session['userId']; // Access the 'email' property stored in the session
  //     console.log("User ID From Session"+body.userId);
  //     return this.userService.getAccountInfo(body.userId);
  //   }
  //   throw new NotFoundException('No data in BODY');

  //}


  
  ///--6 TransectionHistor  many

 @UseGuards(AuthGuard)
  @Roles('User')
  @Get('info-and-transactions')
  async getUserInfoAndTransactions(id: number): Promise<{ transactions: Transactions[] }> {
    return this.userService.getUserInfoAndTransactions(id);
  }


@Roles('user')
@UseGuards(AuthGuard)
@Get('TransactionID')
async TransactionID(  @Req() req):Promise<{}>{
  console.log("User ID From Session"+req.user?.userId); 
  console.log("User ID From Session"+req.user.email);
  console.log("User ID From Session"+req.userId);
  const id = req.userId;
  return await this.userService.getTransactionId(req.user?.userId);
}


  @Get('Hello')
  getHello(): string {
    return "Hello";
  }

}









