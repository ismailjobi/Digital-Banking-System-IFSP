import { Body, Controller, Post, UsePipes, ValidationPipe, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { adminAuthService } from './adminAuth.service';
import { adminLogin } from '../DTOs/AdminLogin.dto';

@Controller('/auth/admin')
export class adminAuthController {
    constructor(private adminAuthService: adminAuthService) { }
    @Post("/login")
    @UsePipes(new ValidationPipe)
    async loginAdmin(@Body() data: adminLogin): Promise<Object> {
        const result = await this.adminAuthService.logIn(data);
        if (result == null) {
            throw new UnauthorizedException("Invalid Credentials !");
        }
        if(!await this.adminAuthService.saveLoginSession(data.Email, result)){
            throw new InternalServerErrorException("Error while saving Login data !");
        }
        return {
            message: "Login Successful",
            token: result
        }
    }
}