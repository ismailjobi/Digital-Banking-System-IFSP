import { IsNotEmpty, Matches } from "class-validator";

export class changePasswordDTO {

    @IsNotEmpty({ message: 'Current password must not be empty' })
    currentPassword: string;

    @IsNotEmpty({ message: 'New password must not be empty' })
    @Matches(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'New password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' })
    newPassword: string;

    @IsNotEmpty({ message: 'Confirm password must not be empty' })
    @Matches(/[A-Za-z\d!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/, { message: 'Confirm password must be at least 8 characters long and contain at least one special character One Upperletter & One Lowerletter' })
    confirmPassword: string;
}