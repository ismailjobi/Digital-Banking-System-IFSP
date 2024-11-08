import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import {EmployeeDTO, changePasswordDTO,profileDTO } from "./DTO/employee.dto";
import { loginDTO} from "../DTO/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./Entity/Account.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { EmailService } from "src/Mailer/mailer.service";
import { Users } from "src/CommonEntities/user.entity";
import { Authentication } from "src/Authentication/Entity/auth.entity";
import { Transactions } from "./Entity/transaction.entity";

@Injectable()
export class EmployeeService {
    [x: string]: any;
    constructor(@InjectRepository(Users) private employeeRepo: Repository<Users>,
    @InjectRepository(Authentication) private autheRepo: Repository<Authentication>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(Transactions) private transactionRepo: Repository<Transactions>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    private jwtService: JwtService,
    private emailService:EmailService

  ) { }

    getUsers(): object {
        return { message: "hellow Admin" }
    }

    async findOne(logindata: loginDTO): Promise<any> {
      try {
          return await this.autheRepo.findOneBy({ Email: logindata.email });
      } catch (error) {
          // Here We Handle The Error 
          throw new Error("Error occurred while finding user.");
      }
  }
}