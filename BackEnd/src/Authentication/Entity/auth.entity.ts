import { AttendanceReports } from "src/Administrator/Entity/AttendanceReports.entity";
import { Role } from "src/Administrator/Entity/Role.entity";
import { SalarySheet } from "src/Administrator/Entity/SalarySheet.entity";
import { Users } from "src/CommonEntities/user.entity";
import {  Column, Entity,  Index,  JoinColumn,  ManyToOne,  OneToMany,  OneToOne, PrimaryColumn } from "typeorm";


@Entity("Authentication")
export class Authentication {
    @PrimaryColumn({ name: 'Email', type: 'varchar', length: 100 })
    Email: string;

    @Column({ name: 'Password',type: 'varchar' })
    Password: string;

    @Column({name: 'Active', default: false })
    Active: boolean;
    
    @Column({type:'varchar', name: "RoleID" })
    roleId: string;

    @ManyToOne(() => Role, Role => Role.Authentications, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "RoleID" })
    Role: Role;

    @OneToOne(() => Users, Users => Users.Authentication)
    User: Users;

    @OneToMany(() => AttendanceReports, AttendanceReports => AttendanceReports.Authentication)
    AttendanceReports: AttendanceReports[];

    @OneToMany(() => SalarySheet, SalarySheet => SalarySheet.Authentication)
    SalarySheet: SalarySheet[];
}
