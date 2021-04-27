import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { CriarCategoriaDTO } from './dtos/criar-categoria.dto';
import { environment } from './environments/environment';

const user = environment.rabbitmq_server_username
const pwd = environment.rabbitmq_server_password
const host = environment.rabbitmq_server_host
const port = environment.rabbitmq_server_port
const virtualhost = environment.rabbitmq_server_virtualhost

@Controller('api/v1')
export class AppController {

  private logger = new Logger(AppController.name);

  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${user}:${pwd}@${host}:${port}/${virtualhost}`],
        queue: 'admin-backend'
      }
    })
  }

  @Post('categorias')
  @UsePipes(ValidationPipe)
  async criarCategoria(
    @Body() criarCategoriaDTO: CriarCategoriaDTO
  ) {
    return await this.clientAdminBackend.emit('criar-categoria', criarCategoriaDTO)
  }

}
