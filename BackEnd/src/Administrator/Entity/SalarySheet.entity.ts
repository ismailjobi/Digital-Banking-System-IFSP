import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Entity, Column, PrimaryGeneratedColumn,JoinColumn,ManyToOne, Index } from 'typeorm';

@Entity("SalarySheet")
export class SalarySheet {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Year: number;

    @Column({ name: "Email" })
    Email: string;

    @Column()
    Salary: number;

    @Column()
    Bonus: number;

    @Column()
    Tax: number;

    @Column()
    Total: number;

    @ManyToOne(() => Authentication, Authentication => Authentication.SalarySheet)
    @JoinColumn({ name: "Email" })
    Authentication: Authentication;
}

