import { AccountEntity } from "./Account.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("Services")
export class ServiceEntity{

    @PrimaryColumn({type: "varchar"})
    serviceId: string;

    @Column({ name: 'ServiceType', type: 'varchar', length: 50 })
    name: string;

    @Column({ name: 'Document' })
    filename: string;

    @Column({ name: 'Status', default: false }) 
    status: boolean;

    @CreateDateColumn({ name: 'ApplicationTime' })
    applicationTime: Date;

    @BeforeInsert()
    generateId():string {
    // Custom logic to generate a 5-digit number
       const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();
       this.serviceId = 'S-' + randomNumber;
       return this.serviceId;
    }

    @ManyToOne(() => AccountEntity, account => account.services)
    @JoinColumn({ name: 'AccountNumber' })
    account: AccountEntity;
}