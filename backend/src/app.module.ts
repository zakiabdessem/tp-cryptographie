import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [CryptoModule, MessagesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
