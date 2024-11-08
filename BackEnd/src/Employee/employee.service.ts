import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import {EmployeeDTO, changePasswordDTO,profileDTO } from "./DTO/employee.dto";
import { loginDTO} from "../DTO/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { EmployeeEntity } from "./Entity/employee.entity";
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AccountEntity } from "./Entity/Account.entity";
import { TransactionEntity } from "./Entity/transaction.entity";
import { ServiceEntity } from "./Entity/service.entity";
import { EmailService } from "src/Mailer/mailer.service";
import { AuthenticationEntity } from "src/Authentication/Entity/auth.entity";

@Injectable()
export class EmployeeService {
    [x: string]: any;
    constructor(@InjectRepository(EmployeeEntity) private employeeRepo: Repository<EmployeeEntity>,
    @InjectRepository(AuthenticationEntity) private autheRepo: Repository<AuthenticationEntity>,
    @InjectRepository(AccountEntity) private accountRepo: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity) private transactionRepo: Repository<TransactionEntity>,
    @InjectRepository(ServiceEntity) private serviceRepo: Repository<ServiceEntity>,
    private jwtService: JwtService,
    private emailService:EmailService

  ) { }

    getUsers(): object {
        return { message: "hellow Admin" }
    }
}