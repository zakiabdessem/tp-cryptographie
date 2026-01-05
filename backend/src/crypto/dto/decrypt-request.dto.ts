import { IsNotEmpty, IsString } from 'class-validator';

export class DecryptRequestDto {
  @IsString()
  @IsNotEmpty()
  ciphertext!: string;

  @IsString()
  @IsNotEmpty()
  iv!: string;

  @IsString()
  @IsNotEmpty()
  authTag!: string;
}

