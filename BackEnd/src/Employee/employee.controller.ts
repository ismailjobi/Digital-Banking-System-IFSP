import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe, Delete, Put, NotFoundException, Patch, Session, InternalServerErrorException, UploadedFiles } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeDTO, profileDTO } from "./DTO/employee.dto";
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AuthGuard } from '../Authentication/auth.guard';
import * as bcrypt from 'bcrypt';
import { Roles } from '../CustomDecorator/roles.decorator';
import { Authentication } from "src/Authentication/Entity/auth.entity";
import { Users } from "src/CommonEntities/user.entity";
import { EmployeeUpdateDTO } from "./DTO/employeeupdate.dto";


@Controller('/api/employee')
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }
    @UseGuards(AuthGuard)
    @Get()
    getUsers(): object {
        return this.employeeService.getUsers();
    }

    //=>[1] Create Account For Accountant
    @Post('/createAccount')
    // @UseGuards(AuthGuard)
    // @Roles('account officer')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'employeePicture', maxCount: 1 },
        { name: 'nomineePicture', maxCount: 1 },
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
    async createAccount(
        @Body() myobj: EmployeeDTO,
        @UploadedFiles() files: { employeePicture?: Express.Multer.File[], nomineePicture?: Express.Multer.File[] }
    ): Promise<EmployeeDTO | string> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(myobj.password, salt);
        myobj.password = hashedPassword;

        // Debugging: Log files and body
        console.log('Files object:', files);

        // Assign the uploaded file names to DTO fields
        if (files.employeePicture && files.employeePicture[0]) {
            myobj.employeeFilename = files.employeePicture[0].filename;
        }
        if (files.nomineePicture && files.nomineePicture[0]) {
            myobj.nomineeFilename = files.nomineePicture[0].filename;
        }

        // Create the account using the service
        return this.employeeService.createAccount(myobj);
    }

    //=>[2]Get Accountent Account
    @Get('/getEmployeeAccount')
    //@UseGuards(AuthGuard)
    //@Roles('account officer')
    getEmployeeAccountInfo(): Promise<Authentication[] | string> {
        return this.employeeService.getAccountInfo();
    }

    //=>[3] Update Accountent Account
    @Put('updateEmployee/:userId')
    // @UseGuards(AuthGuard)
    // @Roles('account officer')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'employeePicture', maxCount: 1 },
        { name: 'nomineePicture', maxCount: 1 },
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
    @UsePipes(new ValidationPipe())
    async updateEmployee(@Param('userId') userId: string,@Body() myobj: EmployeeUpdateDTO,
        @UploadedFiles() files: { employeePicture?: Express.Multer.File[], nomineePicture?: Express.Multer.File[] }
    ): Promise<Users | string> {

        // Debugging: Log files and body
        console.log('Files object:', files);
        console.log(myobj);

        // Assign the uploaded file names to DTO fields
        if (files.employeePicture && files.employeePicture[0]) {
            myobj.employeeFilename = files.employeePicture[0].filename;
        }
        
        return this.employeeService.updateEmployee(userId, myobj);
    }

    //=>[4]Get Accountent Account By ID
    @Get('/getEmployeeAccount/:userId')
    // @UseGuards(AuthGuard)
    // @Roles('account officer')
    getEmployeeAccountInfoById(@Param('userId') userId: string): Promise<Users | string> {
        return this.employeeService.getAccountInfoById(userId);
    }

    //=>[5] Delete Accountent Account
    @Patch('deleteEmployee/:userId')
    //@UseGuards(AuthGuard)
    //@Roles('account officer')
    deleteEmployee(@Param('userId') userId: string): object {
        return this.employeeService.deleteEmployee(userId);
    }

}
