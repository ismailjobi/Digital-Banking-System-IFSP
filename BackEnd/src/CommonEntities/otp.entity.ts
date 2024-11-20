import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Users } from "./user.entity";

@Entity("OTP")

export class OTPs{
    @PrimaryGeneratedColumn()
    Id:number;

    @Column({name:"OTP"})
    otp:string;

    @Column({name:"CreatedAt"})
    createdAt:Date;

    @Column({name:"ExpiredAt"})
    expiredAt:Date;

    @ManyToOne(() => Users, Users => Users.OTPs)
    @JoinColumn({ name: 'User_ID' })
    userId: Users;

}