import { EmployeeEntity } from "src/Employee/Entity/employee.entity";
import {  Column, Entity,  OneToOne, PrimaryColumn } from "typeorm";


@Entity("Authentication")
export class AuthenticationEntity{

    @PrimaryColumn({name:'Email', type: 'varchar', length: 100}) 
    email: string;
    @Column({ type: 'varchar' })
    password: string;
    @Column({name:'Role', type: 'varchar', length: 20 })
    role: string;
    @Column({name:'Active',default:false}) 
    isActive: boolean;
    
    @OneToOne(() => EmployeeEntity, Users => Users.email)
    users: EmployeeEntity;
    
}