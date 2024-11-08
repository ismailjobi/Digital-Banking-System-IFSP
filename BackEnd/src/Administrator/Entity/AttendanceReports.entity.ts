import { Authentication } from 'src/Authentication/Entity/auth.entity';
import { Entity, Column, PrimaryGeneratedColumn, JoinColumn,ManyToOne, Index } from 'typeorm';

@Entity("AttendanceReports")
export class AttendanceReports {
    @PrimaryGeneratedColumn()
    Id: number;

    @Column()
    Year: number;

    @Column({ name: "Email" })
    Email: string;

    @Column()
    Jan: number;

    @Column()
    Feb: number;

    @Column()
    Mar: number;

    @Column()
    Apr: number;

    @Column()
    May: number;

    @Column()
    Jun: number;

    @Column()
    Jul: number;

    @Column()
    Aug: number;

    @Column()
    Sep: number;

    @Column()
    Oct: number;

    @Column()
    Nov: number;

    @Column()
    Dec: number;

    @ManyToOne(() => Authentication, Authentication => Authentication.AttendanceReports, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: "Email" })
    Authentication: Authentication;
}
 