import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  notifyCardCreated(card: any) {
    this.server.emit('cardCreated', card);
  }
  notifyCardDeleted(id: number) {
    this.server.emit('cardDeleted', id);
  }
}