import { Injectable } from '@nestjs/common';
import { CryptoService, EncryptedPayload } from '../crypto/crypto.service';
import { CreateMessageDto } from './dto/create-message.dto';

export interface MessageRecord {
  id: string;
  sender: string;
  recipient: string;
  message: string;
  encrypted: EncryptedPayload;
  signature: string;
  hash: string;
  createdAt: Date;
}

@Injectable()
export class MessagesService {
  private readonly messages: MessageRecord[] = [];

  constructor(private readonly cryptoService: CryptoService) {}

  create(dto: CreateMessageDto): MessageRecord {
    const encrypted = this.cryptoService.encrypt(dto.message);
    const signature = this.cryptoService.sign(dto.message);
    const hash = this.cryptoService.hash(dto.message);

    const record: MessageRecord = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      sender: dto.sender,
      recipient: dto.recipient,
      message: dto.message,
      encrypted,
      signature,
      hash,
      createdAt: new Date(),
    };

    this.messages.push(record);
    return record;
  }

  findAll(): MessageRecord[] {
    return this.messages;
  }
}

