import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  postPrompt(@Body() prompt: { prompt: string }) {
    return this.chatService.getLLMResponse(prompt.prompt);
  }
}
