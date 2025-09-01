import { Injectable } from '@nestjs/common';

export interface ChatMessage {
  fromUserId: string;
  toUserId: string;
  message: string;
  timestamp: Date;
}

@Injectable()
export class ChatService {
  private messages: ChatMessage[] = [];

  saveMessage(message: ChatMessage) {
    this.messages.push(message);
  }

  getMessagesForUser(userId: string): ChatMessage[] {
    return this.messages.filter(m => m.fromUserId === userId || m.toUserId === userId);
  }


}
