import { Entity,Column,PrimaryGeneratedColumn,CreateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Users } from "./user.entity";
import { Transactions } from "src/Employee/Entity/transaction.entity";

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

    @OneToOne(() => Transactions, transactions => transactions.transactionId, {
        nullable: true, // Allow null values
      })
      @JoinColumn({ name: 'Transaction_ID' })
      transactions: Transactions | null; // Explicitly define the type as nullable
    
}