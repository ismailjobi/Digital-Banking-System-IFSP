import { Body, Controller, UsePipes, Post, Req, UseInterceptors, ValidationPipe, UploadedFiles, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDTO } from '../DTO/login.dto';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { MulterError, diskStorage } from "multer";
import { FilesInterceptor } from "@nestjs/platform-express";

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }
  //User Registration Route
  // @Post('/Registration')
  // @UseInterceptors(FilesInterceptor('myFiles', 2, {
  //   fileFilter: (req, file, cb) => {
  //     if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
  //       cb(null, true);
  //     else {
  //       cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
  //     }
  //   },
  //   limits: { fileSize: 300000000 },
  //   storage: diskStorage({
  //     destination: './upload',
  //     filename: function (req, file, cb) {
  //       cb(null, Date.now() + file.originalname)
  //     },
  //   })
  // }))


  // @UsePipes(new ValidationPipe)
  // async createAccount(@Body() myobj: RegistrationUserDto, @UploadedFiles() myFiles: Express.Multer.File[]): Promise<RegistrationUserDto | string> {
  //   const salt = await bcrypt.genSalt();
  //   const hashedpassword = await bcrypt.hash(myobj.password, salt);
  //   myobj.password = hashedpassword;

  //   if (myFiles.length !== 2) {

  //     throw new Error('Please upload exactly two files');
  //   }

  //   myobj.filename = myFiles[0].filename; // First file
  //   myobj.nomineeFilename = myFiles[1].filename; // Second file (nominee file)

  //   return this.authService.signUp(myobj);
  // }

  //=>[23]Login To The Website
  @Post('login')
  async signIn(@Body() logindata: loginDTO, @Req() req: Request) {
    console.log(logindata.email)
    console.log(logindata.password)
    return this.authService.signIn(logindata, req.session);
  }

  
}
