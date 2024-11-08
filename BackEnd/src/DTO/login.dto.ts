import {IsEmail , IsNotEmpty} from "class-validator";
export class loginDTO {

    @IsNotEmpty({ message: 'Email must not be empty' })
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @IsNotEmpty({ message: 'Password must not be empty' })
    password: string;
}