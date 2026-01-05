import { Injectable } from '@nestjs/common';
import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createSign,
  createVerify,
  generateKeyPairSync,
  randomBytes,
} from 'node:crypto';

export type EncryptedPayload = {
  ciphertext: string;
  iv: string;
  authTag: string;
};

@Injectable()
export class CryptoService {
  private readonly aesKey: Buffer;
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor() {
    this.aesKey = this.buildAesKey();
    const keyPair = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    this.privateKey = keyPair.privateKey;
    this.publicKey = keyPair.publicKey;
  }

  encrypt(message: string): EncryptedPayload {
    const initializationVector = randomBytes(12);
    const cipher = createCipheriv('aes-256-gcm', this.aesKey, initializationVector);
    const ciphertext = Buffer.concat([cipher.update(message, 'utf8'), cipher.final()]);
    const authTag = cipher.getAuthTag();

    return {
      ciphertext: ciphertext.toString('base64'),
      iv: initializationVector.toString('base64'),
      authTag: authTag.toString('base64'),
    };
  }

  decrypt(payload: EncryptedPayload): string {
    const decipher = createDecipheriv(
      'aes-256-gcm',
      this.aesKey,
      Buffer.from(payload.iv, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(payload.authTag, 'base64'));
    const plaintext = Buffer.concat([
      decipher.update(Buffer.from(payload.ciphertext, 'base64')),
      decipher.final(),
    ]);
    return plaintext.toString('utf8');
  }

  sign(message: string): string {
    const signer = createSign('RSA-SHA256');
    signer.update(message);
    signer.end();
    const signature = signer.sign(this.privateKey);
    return signature.toString('base64');
  }

  verify(message: string, signature: string): boolean {
    const verifier = createVerify('RSA-SHA256');
    verifier.update(message);
    verifier.end();
    return verifier.verify(this.publicKey, Buffer.from(signature, 'base64'));
  }

  hash(message: string): string {
    return createHash('sha256').update(message).digest('hex');
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  private buildAesKey(): Buffer {
    const secretSource = process.env.AES_SECRET_KEY ?? 'tp-crypto-demo-key';
    return createHash('sha256').update(secretSource).digest();
  }
}

