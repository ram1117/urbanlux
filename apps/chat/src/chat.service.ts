import { ExceptionsService } from '@app/shared/infrastructure/exceptions/exceptions.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ContextChatEngine,
  Settings,
  VectorStoreIndex,
  SimpleDirectoryReader,
  Ollama,
  HuggingFaceEmbedding,
} from 'llamaindex';

@Injectable()
export class ChatService implements OnModuleInit {
  chatEngine: ContextChatEngine;
  constructor(private readonly exceptions: ExceptionsService) {}
  async onModuleInit() {
    const llm = new Ollama({
      model: 'gemma2:2b',
    });
    Settings.embedModel = new HuggingFaceEmbedding({
      modelType: 'BAAI/bge-small-en-v1.5',
      quantized: false,
    });

    const reader = new SimpleDirectoryReader();
    const documents = await reader.loadData(`${__dirname}/data`);
    const index = await VectorStoreIndex.fromDocuments(documents);
    const retriever = index.asRetriever({ similarityTopK: 5 });
    this.chatEngine = new ContextChatEngine({ retriever, chatModel: llm });
  }
  async getLLMResponse(prompt: string) {
    if (!this.chatEngine) {
      this.exceptions.internalServerException({
        message: 'Unable to setup chat',
      });
    }
    try {
      const stream = await this.chatEngine.chat({
        message: prompt,
        stream: true,
      });
      console.log(stream);
    } catch (error) {
      console.error(error);
    }
  }
}
