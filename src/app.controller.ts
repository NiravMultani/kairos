import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { AppService } from './app.service';
import { IRmqEventPayload, RMQ_EVENT } from './tokens';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @EventPattern(RMQ_EVENT.SCHEDULE_TASK)
  async scheduleTask(
    @Payload() payload: IRmqEventPayload[RMQ_EVENT.SCHEDULE_TASK],
  ) {
    try {
      this.logger.log({ data: { payload } }, 'scheduleTask: Event received');
      await this.appService.scheduleTask(payload);
    } catch (err) {
      this.logger.error(
        { data: { payload }, err },
        'scheduleTask: Failed to process RMQ event',
      );
    }
  }

  @EventPattern(RMQ_EVENT.REMOVE_SCHEDULED_TASK)
  async removeScheduledTask(
    @Payload() payload: IRmqEventPayload[RMQ_EVENT.REMOVE_SCHEDULED_TASK],
  ) {
    try {
      this.logger.log(
        { data: { payload } },
        'removeScheduledTask: Event received',
      );
      if (!payload.jobId) {
        return;
      }
      await this.appService.removeScheduledTask(payload.jobId);
    } catch (err) {
      this.logger.error(
        { data: { payload }, err },
        'removeScheduledTask: Failed to process RMQ event',
      );
    }
  }
}
