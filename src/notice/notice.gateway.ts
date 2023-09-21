import { MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { WebSocket } from 'ws';

@WebSocketGateway(3001, { path: "/notice" })
export class NoticeGateway implements OnGatewayConnection {
  handleConnection(socket: WebSocket, dto: any) {
    console.log("连接成功");
  }

  @SubscribeMessage('chat')
  handelChat(@MessageBody() data:any, socket: WebSocket) {
    console.log(data);
    return {
      event: "chat",
      data
    }
  }
}
