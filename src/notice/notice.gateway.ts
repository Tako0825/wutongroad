import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from '@nestjs/websockets';
import { Notice, User } from '@prisma/client';
import { IncomingMessage } from 'http';
import { CommonService } from 'src/common/common.service';
import { PrismaModel } from 'src/common/enum/PrismaModel';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Server, WebSocket } from 'ws';

@WebSocketGateway(3001, { path: "/notice" })
export class NoticeGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server
  // 客户端在线列表
  onlineList: object = new Object()

  constructor(
    private prisma:PrismaService,
    private commonService:CommonService
  ) {}

  handleConnection(client: WebSocket, data: IncomingMessage) {
    // ...
  }

  handleDisconnect(client: WebSocket) {
    // 遍历客户端在线列表, 将当前离线用户从列表中移除
    for(let key in this.onlineList) {
      if(this.onlineList[key] === client) {
        delete this.onlineList[key]
        console.log("断开连接-1")
      }
    }
  }

  @SubscribeMessage("user-connect")
  async handleUserConnect(@MessageBody() user_id:string, @ConnectedSocket() client: any) {
    // 尝试判断用户是否存在, 若存在则将其添加至在线列表
    try {
      const user:User = await this.commonService.getEntityByUuid
      (PrismaModel.user, user_id)
      if(!this.onlineList[user_id]) {
        this.onlineList[user_id] = client
        console.log(`在线用户+1————${user.nickname}(${user.uuid})`)
      }
    } catch(httpException) {
      throw new WsException(httpException)
    }
  }

  // todo - 实时发送通知 (新建消息后发出)
  async sendNotice(notice_id: string) {
    const notice = await this.commonService.getEntityByUuid(PrismaModel.notice, notice_id)
    const { recipient_id } = notice
    // 判断收件人是否在线, 如果在线就实时发送通知
    if(this.onlineList[recipient_id]) {
      const client = this.onlineList[recipient_id]
      client.send(JSON.stringify({
        event: "send-notice",
        data: notice
      }))
    }
  }
}
