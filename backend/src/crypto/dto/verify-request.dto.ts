import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyRequestDto {
  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsString()
  @IsNotEmpty()
  signature!: string;
}

