import { Controller, Get } from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

@ApiTags('Healthcheck')
@Controller()
export class AppController {

  @Get('/healthcheck')
  healthcheck() {
    return 'OK';
  }
}
