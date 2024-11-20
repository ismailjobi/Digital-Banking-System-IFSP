import { Body, Controller, UsePipes, Post, Req, UseInterceptors, ValidationPipe, UploadedFiles, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from '../DTO/login.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { MulterError, diskStorage } from "multer";
import { FileFieldsInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { RegistrationUserDto } from 'src/User/UserDTO/user.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  //User Registration Route
  @Post('registration')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'UserFilename', maxCount: 1 },
    { name: 'nomineeFileName', maxCount: 1 },
], {
    fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            cb(null, true);
        } else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname), false);
        }
    },
    limits: { fileSize: 300000000 },
    storage: diskStorage({
        destination: './upload',
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
}))


  @UsePipes(new ValidationPipe)
  async createAccount(@Body() myobj: RegistrationUserDto, @UploadedFiles() myFiles:  { UserFilename?: Express.Multer.File[], nomineeFileName?: Express.Multer.File[] } ): Promise<RegistrationUserDto | string>
   {
    const salt = await bcrypt.genSalt();
    const hashedpassword = await bcrypt.hash(myobj.password, salt);
    myobj.password = hashedpassword;

    console.log(myFiles.nomineeFileName);
    console.log(myFiles.UserFilename);

    if (myFiles.UserFilename && myFiles.UserFilename[0]) {
      myobj.UserFileName = myFiles.UserFilename[0].filename;
  }
  if (myFiles.nomineeFileName && myFiles.nomineeFileName[0]) {
      myobj.nomineeFileName = myFiles.nomineeFileName[0].filename;
  }

    return this.authService.signUp(myobj);
  }

  //=>[23]Login To The Website
  @Post('login')
  async signIn(@Body() logindata: loginDTO, @Req() req: Request) {
    console.log(logindata.email)
    console.log(logindata.password)

    return this.authService.signIn(logindata, req.session);
  }


}
