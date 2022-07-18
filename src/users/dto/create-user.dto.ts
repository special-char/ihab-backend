import {
  IsEmail,
  IsEmpty,
  isEmpty,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  readonly status: UserStatus;

  readonly phoneNumber: string;
}
