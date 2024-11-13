import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Res, Session, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from "./user.service";
import { Roles } from 'src/CustomDecorator/roles.decorator';
import { AuthGuard } from 'src/Authentication/auth.guard';

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


  



  @Get('Hello')
  getHello(): string {
    return "Hello";
  }

}









