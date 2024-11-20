import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Authentication } from "src/Authentication/Entity/auth.entity";

@Entity("FormerEmployees")
export class FormerEmployee {
    @PrimaryGeneratedColumn({ name: "FormerEmployeeId" })
    formerEmployeeId: number;

    @Column({ type: 'varchar', name: "UserId" })
    userId: string;

    @Column({ type: 'varchar', name: "FullName" })
    fullName: string;

    @Column({ type: 'varchar', name: "Gender" })
    gender: string;

    @Column({ type: 'date', name: "DOB" })
    dob: Date;

    @Column({ type: 'varchar', name: "NID" })
    nid: string;

    @Column({ type: 'varchar', name: "Phone" })
    phone: string;

    @Column({ type: 'varchar', name: "Address" })
    address: string;

    @Column({ type: 'varchar', name: "FileName" })
    filename: string; // PictureName

    @Column({ type: 'date', name: "DepartureDate" })
    departureDate: Date;

    @Column({ type: 'varchar', name: "FormerRole" })
    formerRole: string;

    
}
