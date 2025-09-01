import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({ cors: { origin: '*' } })
@Injectable()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private users: Map<string, { userId: number; username: string; role: string }> = new Map();
  private userSocket: Map<number, string> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(socket: Socket) {
    const token = socket.handshake.query.token as string;
    if (!token) {
      socket.emit('error', 'No token provided');
      socket.disconnect();
      return;
    }

    let payload: any;
    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      socket.emit('error', 'Invalid or expired token');
      socket.disconnect();
      return;
    }

    const userInfo = {
      userId: payload.sub,
      username: payload.email,
      role: payload.role,
    };

    this.users.set(socket.id, userInfo);
    this.userSocket.set(userInfo.userId, socket.id);

    socket.emit('connected', { userId: userInfo.userId, username: userInfo.username, role: userInfo.role });
  }

  async handleDisconnect(socket: Socket) {
    const userInfo = this.users.get(socket.id);
    if (userInfo) {
      this.userSocket.delete(Number(userInfo.userId));
      this.server.emit('user_offline', { userId: userInfo.userId, username: userInfo.username });
    }
    this.users.delete(socket.id);
  }

  @SubscribeMessage('message')
  handleMessage(
    @MessageBody() data: { receiverId: string; message: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const receiverIdint = parseInt(data.receiverId, 10);

    const sender = this.users.get(socket.id);
    if (!sender) {
      socket.emit('error', 'User not authenticated');
      return;
    }

    const receiverSocketId = this.userSocket.get(receiverIdint);
    if (receiverSocketId) {
      console.log(`Sending message from ${sender.userId} to ${receiverIdint} at socket ${receiverSocketId}`);
      this.server.to(receiverSocketId).emit('message', {
        from: sender.userId,
        fromUsername: sender.username,
        message: data.message,
        timestamp: new Date(),
      });
    } else {
      socket.emit('error', 'Receiver is offline or not connected');
    }
  }
}
