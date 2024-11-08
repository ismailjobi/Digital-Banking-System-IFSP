import { Optional } from "@nestjs/common";
import { IsNotEmpty, Matches } from "class-validator";


export class serviceDTO{
   

    //serviceId: number;
    @IsNotEmpty()
    @Matches(/^\d{8}(?:\d{8})?$/) @Optional()
    accountNumber: number;

 
    @IsNotEmpty()
    name: string;
 
   filename: string;
 

    status: boolean;
 
     @Optional()
    applicationTime: Date;
   // isActive: boolean;
}