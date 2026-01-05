import { IsNotEmpty, IsString } from 'class-validator';

export class SignRequestDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}

