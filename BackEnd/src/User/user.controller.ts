import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Res, Session, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';

import { UserService } from "./user.service";

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) { }
  // @UseGuards(AuthGuard)

  @Get()
  getUser(): string {
    return this.userService.getUser();
  }

}









