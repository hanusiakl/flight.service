import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const hostEnvironment = process.env.HOST_ENVIRONMENT;

    return `AppController with envrionment [< ${hostEnvironment} >]`;
  }
}
