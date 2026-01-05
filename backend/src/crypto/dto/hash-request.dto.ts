import { IsNotEmpty, IsString } from 'class-validator';

export class HashRequestDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}

