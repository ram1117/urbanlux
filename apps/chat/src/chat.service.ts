import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ChatService implements OnModuleInit {
  onModuleInit() {
    throw new Error('Method not implemented.');
  }
  async getLLMResponse(prompt: string) {
    return prompt;
  }
}
