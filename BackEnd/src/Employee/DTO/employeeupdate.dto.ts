import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, Matches, MaxLength } from "class-validator";

export class EmployeeUpdateDTO {

    @Optional()
    userId: number;

    @IsNotEmpty({ message: 'Name must not be empty' })
    @MaxLength(150, { message: 'Name can be at most 150 characters long' })
    name: string;

    @IsNotEmpty({ message: 'Gender must not be empty' })
    @Matches(/^(male|female)$/i, { message: 'Gender must be either "male" or "female"' })
    gender: string;

    @IsNotEmpty({ message: 'Date of birth must not be empty' })
    dob: Date;
    
    @IsNotEmpty({ message: 'Phone number must not be empty' })
    @Matches(/^01\d*$/, { message: 'Phone number must start with "01"' })
    phone: string;

    @IsNotEmpty({ message: 'Address must not be empty' })
    address: string;

    employeeFilename: string;

    @Optional()
    isActive: boolean;

    @Optional()
    @MaxLength(100, { message: 'Email can be at most 100 characters long' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Optional()
    @Matches(/^\d{8}(?:\d{8})?$/, { message: 'NID must be 8 digits long' })
    nid: string;
}



