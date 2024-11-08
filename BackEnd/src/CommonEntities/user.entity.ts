import { Authentication } from "src/Authentication/Entity/auth.entity";
import { AccountEntity } from "../Employee/Entity/Account.entity";
import { Transactions } from "../Employee/Entity/transaction.entity";
import { BeforeInsert, Column, Entity, Index, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";
import { randomBytes } from "crypto";

@Entity("Users")
export class Users {
    @PrimaryColumn()
    userId: string;

    @Column()
    FullName: string;

    @Column({ name: "Email" })
    Email: string;

    @Column()
    Gender: string;

    @Column({ type: 'date' })
    DOB: Date;

    @Column()
    NID: string;

    @Column()
    Phone: string;

    @Column()
    Address: string;

    @Column()
    FileName: string; // PictureName

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
        this.userId = "U-" + parseInt(randomBytesBuffer.toString('hex'), 16) % 1000000; // 6 digit -> 10e6
    }
}


