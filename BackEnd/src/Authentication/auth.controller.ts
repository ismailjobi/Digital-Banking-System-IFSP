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

  //=>[23]Login To The Website
  @Post('login')
  async signIn(@Body() logindata: loginDTO, @Req() req: Request) {
    console.log(logindata.email)
    console.log(logindata.password)
    return this.authService.signIn(logindata, req.session);
  }

  
}
