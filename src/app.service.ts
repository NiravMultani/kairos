import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { JobOptions, Queue } from 'bull';
import { DEFAULT_QUEUE, IRmqEventPayload, RMQ_EVENT } from './tokens';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectQueue(DEFAULT_QUEUE) private readonly kairosQueue: Queue,
  ) {}

  async scheduleTask(payload: IRmqEventPayload[RMQ_EVENT.SCHEDULE_TASK]) {
    let jobOpt: JobOptions;
    if (payload.type === 'dateTime') {
      jobOpt = {
        removeOnComplete: true,
        removeOnFail: true,
        delay: new Date(payload.date).getTime() - Date.now(),
        jobId: payload.jobId,
      };
    } else if (payload.type === 'cron') {
      jobOpt = {
        removeOnFail: true,
        repeat: {
          cron: payload.cron,
          limit: 1,
          tz: 'Etc/UTC',
        },
        jobId: payload.jobId,
      };
    } else {
      this.logger.error({ data: { payload } }, 'Invalid payload type');
      return;
    }

    await this.kairosQueue.removeJobs(payload.jobId).catch((err) => {
      this.logger.error(
        { err, data: { jobId: payload.jobId } },
        'Failed to remove job',
      );
    });
    await this.kairosQueue
      .add(
        {
          cbQueue: payload.callbackQueue,
          cbEvent: payload.callbackEvent,
          cbData: payload.data,
        },
        jobOpt,
      )
      .catch((err) => {
        this.logger.error(
          { err, data: { jobId: payload.jobId } },
          'Failed to add job',
        );
      });
    this.logger.log({ data: { jobId: payload.jobId } }, 'Job scheduled');
  }

  async removeScheduledTask(jobId: string) {
    await this.kairosQueue.removeJobs(jobId);
    this.logger.log({ data: { jobId } }, 'Job removed');
  }
}
