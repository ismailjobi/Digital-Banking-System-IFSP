//#region : imports
import { BadRequestException, Body, ConflictException, Controller, Delete, Get, InternalServerErrorException, Param, Patch, Post, Put, Query, Req, UseGuards, UsePipes, ValidationPipe, Request, Res, UnauthorizedException } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { adminAuthGuard } from './Auth/adminAuth.guard';
import { JwtService } from "@nestjs/jwt";

//#endregion: imports

const tempFolder = './uploads/admin/temp';
const storageFolder = './uploads/admin/storage';

@Controller('/admin')
export class AdminController {
    constructor(private readonly adminService: AdminService,
        private readonly jwtService: JwtService
    ) { }

    //#region : Role
    @UseGuards(adminAuthGuard)
    @Get()
    getUsers(): object {
        return this.adminService.getUsers();
    }
    
}