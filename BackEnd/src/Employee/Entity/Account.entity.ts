import { Users } from "../../CommonEntities/user.entity";
import { ServiceEntity } from "./service.entity";
import { BeforeInsert, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryColumn} from "typeorm";

@Entity("AccountInfo")
export class AccountEntity {
    @PrimaryColumn({ name: 'AccountNumber' })
    accountNumber: number;

    @Column({ name: 'NomineeName', type: 'varchar', length: 150 })
    name: string;

    @Column({ name: 'Gender', type: 'varchar', length: 6 })
    gender: string;

    @Column({ name: 'DOB', type: 'date' })
    dob: Date;

    @Column({ name: 'NomineeNID',type: 'varchar', unique: true })
    nid: string;

    @Column({ name: 'Phone', type: 'varchar' })
    phone: string;

    @Column({ name: 'Address', type: 'varchar' })
    address: string;

    @Column({ name: 'NomineePicture', type: 'varchar' })
    filename: string;

    @Column({ name: 'AccountType', type: 'varchar', nullable: true })
    accountType: string;

    @Column({ name: 'Balance', default: 0, nullable: true })
    balance: number;

    @Column({ name: 'AccountStatus', default: true })
    accountStatus: boolean;
  nomineeName: any;
  nomineeGender: any;
  nomineeDob: any;
  nomineeAddress: any;

    @BeforeInsert()
    generateAccountNumber(): number {
        // Custom logic to generate a 8-digit number
        const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
        this.accountNumber = randomNumber;
        return this.accountNumber;
    }

    @ManyToOne(() => Users, Users => Users.Accounts)
    @JoinColumn({ name: 'User_ID' })
    userId: Users;

    @OneToMany(() => ServiceEntity, service => service.account)
    services: ServiceEntity[];
}
