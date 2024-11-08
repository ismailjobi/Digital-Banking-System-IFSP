import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity("LoginSessions")
export class LoginSessions {
    @PrimaryGeneratedColumn()
    Id: number;
    
    @Column({name:"Email"})
    Email: string;
    
    @Column()
    Token: string;

    @CreateDateColumn({ name: "createdAt" })
    createdAt: Date;

    @Column({ name: "deletedAt", nullable: true })
    deletedAt: Date;
}
