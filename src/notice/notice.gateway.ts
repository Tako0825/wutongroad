import { OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';

@WebSocketGateway(3001)
export class NoticeGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server

  handleConnection(client: any, ...args: any[]) {
    //...
  }

  @SubscribeMessage('chat')
  handleMessage(client: any, payload: any) {
    console.log(client);
    console.log(payload);
    return {
      event: "chat",
      return: "hello."
    }
  }
}
