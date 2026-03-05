import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PubSubService } from './pub-sub.service';

@ApiTags('Pub-Sub')
@Controller('pub-sub')
export class PubSubController {
  constructor(private readonly pubSubService: PubSubService) {}

  @Post('emit')
  async emit(@Body() body: { message: string }): Promise<{ emitted: string }> {
    await this.pubSubService.emit(body);
    return { emitted: body.message };
  }

  @Post('subscribe')
  async subscribe() {
    await this.pubSubService.subscribe();
    return { status: 'subscribed' };
  }
}
