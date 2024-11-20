import { Users } from "../../CommonEntities/user.entity";
import {  BeforeInsert, Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";

@Entity("Transaction")
export class Transactions {
    @PrimaryColumn({ type: "varchar" })
    transactionId: string;

    @Column({ name: 'AccountNumber' })
    accountNumber: number;

    @Column({ name: 'ReceiverAccount' })
    receiverAccount: number;

    @Column({ name: 'Amount' })
    amount: number;

    @Column({ name: 'ReceiverName', length: 100, type: "varchar" })
    receiverName: string;

    @Column({ name: 'BankCode' })
    bankCode: number;

    @Column({ name: 'RoutingNumber' })
    routingNumber: number;

    @Column({name:'AccountType',length: 100,type: "varchar"})
    accountType: string;

    @Column({ name: 'TransferType', length: 20, type: "varchar" })
    transferType: string;

    @Column({ name: 'Status', default: true })
    transactionStatus: boolean;

    @CreateDateColumn({ name: 'TransactionTime' })
    applicationTime: Date;

    @BeforeInsert()
    generateId(): string {
        const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();
        this.transactionId = 'T-' + randomNumber;
        return this.transactionId;
    }

    @ManyToOne(() => Users, Users => Users.Transactions)
    @JoinColumn({ name: 'User_ID' })
    userId: Users;
}

