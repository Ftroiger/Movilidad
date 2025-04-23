import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { EventPattern } from '@nestjs/microservices/decorators';

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //@Get()
  //getHello(): string {
  //  return this.usersService.getHello();
  //}
  @EventPattern('new_user')
  handleNewUser(data: any) {
    console.log('new_user: ', data);
  }
}
