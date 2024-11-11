import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EmployeeService } from '../Employee/employee.service';
import { loginDTO } from '../DTO/login.dto';
import * as bcrypt from 'bcrypt';
import { Session } from 'express-session';
import { RegistrationUserDto } from 'src/User/UserDTO/user.dto';
import { UserService } from '../User/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) { }

  async signUp(myobj: RegistrationUserDto): Promise<RegistrationUserDto | string> {
    return await this.userService.addAccount(myobj);
  }
  
  async signIn(logindata: loginDTO, session: Session): Promise<{ access_token: string, role: string,userId:string }> {
    try {
      const user = await this.employeeService.findOne(logindata);
      if (!user) {
        throw new UnauthorizedException("This Account is Not Found");
      }
      console.log(user.users.userId)
      if (!user.isActive) {
        throw new UnauthorizedException("Your Account Is Not Active.");
      }
      const isMatch = await bcrypt.compare(logindata.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException("Please Give Valid Data");
      }
      const payload = { email: user.email, role: user.role };
      console.log('User Roles Service:', user.role);
      // Store data in session
      session['email'] = user.email;
      console.log(session['email']);
      return {
        access_token: await this.jwtService.signAsync(payload),
        role: user.role,
        userId:user.users.userId
      };
    } catch (error) {
      // Here We Handle The Error 
      throw error;
    }
  }
  

}