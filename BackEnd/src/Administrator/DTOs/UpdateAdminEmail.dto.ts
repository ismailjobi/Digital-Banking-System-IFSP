import { IsEmail, IsNotEmpty} from "class-validator";
export class UpdateAdminEmail{
    
    @IsNotEmpty()
    @IsEmail({}, { message: "Invalid email format" }) 
    NewEmail: string;
}