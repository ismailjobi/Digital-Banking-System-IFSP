import { randomBytes } from 'crypto';
import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Entity, Column, BeforeInsert, PrimaryColumn,OneToMany, OneToOne, Index } from 'typeorm';
import { BaseSalary } from './BaseSalary.entity';

@Entity("Role")
export class Role {
    @PrimaryColumn()
    Id: string;

    @Column()
    Name: string;

    @OneToMany(() => Authentication, Authentication => Authentication.Role)
    Authentications: Authentication[];

    @OneToOne(() => BaseSalary, BaseSalary => BaseSalary.Role)
    BaseSalary: BaseSalary;

    @BeforeInsert()
    generateID() {
        const randomBytesBuffer = randomBytes(4);
        this.Id = "R-" + parseInt(randomBytesBuffer.toString('hex'), 16) % 10000; //4 digit -> 10e4
    }
}

