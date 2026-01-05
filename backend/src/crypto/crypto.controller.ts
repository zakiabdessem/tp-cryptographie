import { Body, Controller, Get, Post } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptRequestDto } from './dto/encrypt-request.dto';
import { DecryptRequestDto } from './dto/decrypt-request.dto';
import { SignRequestDto } from './dto/sign-request.dto';
import { VerifyRequestDto } from './dto/verify-request.dto';
import { HashRequestDto } from './dto/hash-request.dto';

@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('encrypt')
  encrypt(@Body() dto: EncryptRequestDto) {
    return this.cryptoService.encrypt(dto.message);
  }

  @Post('decrypt')
  decrypt(@Body() dto: DecryptRequestDto) {
    const plaintext = this.cryptoService.decrypt({
      ciphertext: dto.ciphertext,
      iv: dto.iv,
      authTag: dto.authTag,
    });
    return { plaintext };
  }

  @Post('sign')
  sign(@Body() dto: SignRequestDto) {
    const signature = this.cryptoService.sign(dto.message);
    return { signature };
  }

  @Post('verify')
  verify(@Body() dto: VerifyRequestDto) {
    const isValid = this.cryptoService.verify(dto.message, dto.signature);
    return { isValid };
  }

  @Post('hash')
  hash(@Body() dto: HashRequestDto) {
    const hash = this.cryptoService.hash(dto.message);
    return { hash };
  }

  @Get('public-key')
  getPublicKey() {
    return { publicKey: this.cryptoService.getPublicKey() };
  }
}

