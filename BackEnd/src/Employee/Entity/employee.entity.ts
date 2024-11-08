import { AuthenticationEntity } from "src/Authentication/Entity/auth.entity";
import { AccountEntity } from "./Account.entity";
import { TransactionEntity } from "./transaction.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity("Users")
export class EmployeeEntity{

    @PrimaryColumn({type: "varchar"})
    userId: string;
    @Column({name:'FulName', type: 'varchar', length: 150 })
    name: string;
    @Column({name:'Gender', type: 'varchar', length: 6 })
    gender: string;
    @Column({name:'DOB', type: Date })
    dob: Date ;
    @Column({name:'NID',unique: true})
    nid: number;
    @Column({name:'Phone',type: 'varchar'})
    phone: string;
    @Column({name:'Address'})
    address: string;
    @Column({name:'FileName'})
    filename: string;
   
    //@BeforeInsert()
    generateId():string {
    // Custom logic to generate a 6-digit number
       const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
       this.userId = 'E-' + randomNumber;
       return this.userId;
    }
    
    //@BeforeInsert()
    generateUserId():string {
    // Custom logic to generate a 6-digit number
        const randomNumber = Math.floor(100000 + Math.random() * 900000).toString();
        this.userId = 'U-' + randomNumber;
        return this.userId;
    }

    @OneToOne(() => AuthenticationEntity, Authentication => Authentication.users, { cascade: true , onDelete: 'CASCADE' })
    @JoinColumn({name:'Email'})
    email: AuthenticationEntity;
    @OneToMany(() => AccountEntity, Accounts => Accounts.user, { cascade: true , onDelete: 'CASCADE' })
    Accounts: AccountEntity[];
    @OneToMany(() => TransactionEntity, Transactions => Transactions.user)
    Transactions: TransactionEntity[];
    
}

