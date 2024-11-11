import { Authentication } from "src/Authentication/Entity/auth.entity";
import { AccountEntity } from "../Employee/Entity/Account.entity";
import { Transactions } from "../Employee/Entity/transaction.entity";
import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { randomBytes } from "crypto";

@Entity("Users")
export class Users {
    @PrimaryColumn({type:'varchar', name: "UserId" })
    userId: string;

    @Column({type:'varchar', name: "FullName" })
    fullName: string;

    @Column({type:'varchar', name: "Gender" })
    gender: string;

    @Column({ type: 'date',name:"DOB" })
    dob: Date;

    @Column({type:'varchar', name: "NID" })
    nid: string;

    @Column({type:'varchar', name: "Phone" })
    phone: string;

    @Column({type:'varchar', name: "Address" })
    address: string;

    @Column({type:'varchar', name: "FileName" })
    filename: string; // PictureName

    @OneToOne(() => Authentication, Authentication => Authentication.User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "Email" })
    Authentication: Authentication;

    @OneToMany(() => AccountEntity, Accounts => Accounts.userId, { cascade: true, onDelete: 'CASCADE' })
    Accounts: AccountEntity[];

    @OneToMany(() => Transactions, Transactions => Transactions.userId)
    Transactions: Transactions[];

    @BeforeInsert()
    generateID() {
        const randomBytesBuffer = randomBytes(4);
        this.userId= "U-" + parseInt(randomBytesBuffer.toString('hex'), 16) % 1000000; //6 digit -> 10e6
    }
    
    //used manually
    generateId(): string {
        // Custom logic to generate a 6-digit number
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'E-' + randomNumber;
        return this.userId;
    }
    
    //used manually
    generateUserId(): string {
        // Custom logic to generate a 6-digit number
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'U-' + randomNumber;
        return this.userId;
    }
}


