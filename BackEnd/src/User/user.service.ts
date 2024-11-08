import { Injectable, NotFoundException, Patch, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Transaction } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { AccountEntity } from '../Employee/Entity/Account.entity';
import { ServiceEntity } from '../Employee/Entity/service.entity';
import { EmailService } from 'src/Mailer/mailer.service';
import { Users } from 'src/CommonEntities/user.entity';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Transactions } from 'src/Employee/Entity/transaction.entity';


@Injectable()
export class UserService {

    constructor(@InjectRepository(Users) private userRepository: Repository<Users>,
    private jwtService: JwtService,
    private emailService:EmailService,
    @InjectRepository(Authentication) private authRepository: Repository<Authentication>, 
    @InjectRepository(AccountEntity) private accountRepository: Repository<AccountEntity>,
    @InjectRepository(Transactions) private tansactionRepository: Repository<Transactions>, 
    @InjectRepository(ServiceEntity) private serviceRepository: Repository<ServiceEntity>) {}

    getUser():string{
        return"hello";
    }

}


