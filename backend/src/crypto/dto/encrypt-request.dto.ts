import { IsNotEmpty, IsString } from 'class-validator';

export class EncryptRequestDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}

