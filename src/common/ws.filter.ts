import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch()
export class WsFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    super.catch(exception, host);
    const client:Socket = host.switchToWs().getClient();
    const error = exception.getError();
    client.send(error)
  }
}
