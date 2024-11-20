import { Optional } from "@nestjs/common";
import { IsEmail, IsNotEmpty, Matches, MaxLength } from "class-validator";

export class EmployeeDTO {

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

    @IsNotEmpty({ message: 'NID must not be empty' })
    @Matches(/^\d{8}(?:\d{8})?$/, { message: 'NID must be 8 digits long' })
    nid: string;

    @IsNotEmpty({ message: 'Phone number must not be empty' })
    @Matches(/^01\d*$/, { message: 'Phone number must start with "01"' })
    phone: string;

    @MaxLength(100, { message: 'Email can be at most 100 characters long' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Address must not be empty' })
    address: string;

    employeeFilename: string;

    @Optional()
    isActive: boolean;

    @IsNotEmpty({ message: 'Password must not be empty' })
    @Matches(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'Password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' })
    password: string;

    @Optional()
    role: string;

    @IsNotEmpty()
    nomineeName: string;
    
    @IsNotEmpty()
    @Matches(/^(male|female)$/i)
    nomineeGender: string;

    @IsNotEmpty()
    nomineedob: Date;

    @IsNotEmpty()
    @Matches(/^\d{8}(?:\d{8})?$/)
    nomineenNid: string;

    @IsNotEmpty()
    @Matches(/^01\d{9}$/)
    nomineephone: string;

    @IsNotEmpty()
    nomineeAddress: string;

    nomineeFilename: string;

    @Matches(/^(current|saving|salary)$/i)
    accountType: string;
    
    @Optional()
    accountStatus :boolean;
    
    @Optional()
    balance: number;
  accountNumber: any;
}

export class profileDTO {
    @Optional()
    @IsNotEmpty({ message: 'User ID must not be empty' })
    userId: string;

    @IsNotEmpty({ message: 'Name must not be empty' })
    @MaxLength(150, { message: 'Name can be at most 150 characters long' })
    name: string;

    @IsNotEmpty({ message: 'Gender must not be empty' })
    @Matches(/^(male|female)$/i, { message: 'Gender must be either "male" or "female"' })
    gender: string;

    @IsNotEmpty({ message: 'Date of birth must not be empty' })
    dob: string;

    @Optional()
    @IsNotEmpty({ message: 'NID must not be empty' })
    @Matches(/^\d{8}(?:\d{8})?$/, { message: 'NID must be 8 digits long' })
    nid: string;

    @IsNotEmpty({ message: 'Phone number must not be empty' })
    @Matches(/^01\d*$/, { message: 'Phone number must start with "01"' })
    phone: string;

    @Optional()
    @MaxLength(100, { message: 'Email can be at most 100 characters long' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Address must not be empty' })
    address: string;

    @Optional()
    filename: string;

    @Optional()
    @IsNotEmpty({ message: 'Role must not be empty' })
    role: string;
  
}

