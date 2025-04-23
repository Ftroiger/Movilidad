import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(@Inject('USERS_SERVICE') private usersClient: ClientProxy) {}

  getHello(): string {
    return 'APP Principal';
  }

  newUser(user: any) {
    this.usersClient.emit('new_user', user);
    return 'User created';
  }
}
