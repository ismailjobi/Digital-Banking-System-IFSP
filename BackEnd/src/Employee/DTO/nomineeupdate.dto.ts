import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsOptional, Matches, IsBoolean, IsNumber, IsDate, IsString } from 'class-validator';

export class UpdateNomineeDto {
  @IsNotEmpty()
  @IsString()
  nomineeName: string;

  @IsNotEmpty()
  @Matches(/^(male|female)$/i, { message: 'nomineeGender must be either male or female' })
  nomineeGender: string;

  @IsNotEmpty()
  @IsDate()
  nomineedob: Date;

  @IsNotEmpty()
  @Matches(/^\d{8}(?:\d{8})?$/, { message: 'nomineenNid must be 8 or 16 digits' })
  nomineenNid: string;

  @IsNotEmpty()
  @Matches(/^01\d{9}$/, { message: 'nomineephone must be a valid Bangladeshi phone number' })
  nomineephone: string;

  @IsNotEmpty()
  @IsString()
  nomineeAddress: string;

  @Optional()
  @IsString()
  nomineeFilename: string;

  @Optional()
  @Matches(/^(current|saving|salary)$/i, { message: 'accountType must be one of current, saving, or salary' })
  accountType: string;

  @Optional()
  @IsBoolean()
  accountStatus: boolean;
 
}
