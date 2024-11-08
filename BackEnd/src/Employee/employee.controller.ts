import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe, Delete, Put, NotFoundException, Patch, Session, InternalServerErrorException } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeDTO, changePasswordDTO, profileDTO } from "./DTO/employee.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AuthGuard } from '../Authentication/auth.guard';
import * as bcrypt from 'bcrypt';
import { Roles } from '../CustomDecorator/roles.decorator';


@Controller('/employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }
    @UseGuards(AuthGuard)
    @Get()
    getUsers(): object {
        return this.employeeService.getUsers();
    }
}
