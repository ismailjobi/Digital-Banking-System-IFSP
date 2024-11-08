import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import {EmployeeEntity } from '../Employee/Entity/employee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { TransactionEntity } from '../Employee/Entity/transaction.entity';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { EmailService } from 'src/Mailer/mailer.service';
import { AuthenticationEntity } from 'src/Authentication/Entity/auth.entity';

@Injectable()
export class UserService {

    constructor(@InjectRepository(EmployeeEntity) private userRepository: Repository<EmployeeEntity>,
    private jwtService: JwtService,
    private emailService:EmailService,
    @InjectRepository(AuthenticationEntity) private authRepository: Repository<AuthenticationEntity>, 
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(TransactionEntity) private tansactionRepository: Repository<TransactionEntity>, 
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>) {}

    getUser():string{
        return"hello";
    }

}


