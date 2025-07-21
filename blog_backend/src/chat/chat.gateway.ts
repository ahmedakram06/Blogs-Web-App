import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface JoinRoomPayload {
  userId: string;
  roomName: string;
  userName: string;
}

interface MessagePayload {
  roomName: string;
  senderId: string;
  receiverId: string;
  message: string;
  timeSent: number;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private server: Server;
  private onlineUsers: Record<string, { userId: string; name: string }> = {};

  afterInit(server: Server) {
    this.server = server;
    console.log('Chat gateway initialized');
  }

  handleConnection(socket: Socket) {
    console.log(`Client connected: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    console.log(`Client disconnected: ${socket.id}`);
    delete this.onlineUsers[socket.id];
    this.broadcastOnlineUsers();
  }

  //Event Handlers
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() payload: JoinRoomPayload,
    @ConnectedSocket() socket: Socket,
  ) {
    this.onlineUsers[socket.id] = {
      userId: payload.userId,
      name: payload.userName,
    };

    await socket.join(payload.roomName);
    console.log(`${payload.userName} joined room ${payload.roomName}`);

    this.broadcastOnlineUsers();
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(@MessageBody() payload: MessagePayload) {
    console.log(
      `Message from ${payload.senderId} to ${payload.receiverId}: ${payload.message}`,
    );

    this.server.to(payload.roomName).emit('receiveMessage', payload);
  }

  private broadcastOnlineUsers() {
    const users = Object.values(this.onlineUsers).map((u) => ({
      id: u.userId,
      name: u.name,
    }));
    this.server.emit('online-users', users);
  }
}
