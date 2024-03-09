import {
  OnQueueActive,
  OnQueueCleaned,
  OnQueueCompleted,
  OnQueueDrained,
  OnQueueError,
  OnQueueFailed,
  OnQueuePaused,
  OnQueueProgress,
  OnQueueRemoved,
  OnQueueResumed,
  OnQueueStalled,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy, RmqRecordBuilder } from '@nestjs/microservices';
import { Job } from 'bull';
import { DEFAULT_QUEUE, RMQ_QUEUE, ServiceNames } from './tokens';

@Processor(DEFAULT_QUEUE)
export class KairosProcessor {
  private readonly logger = new Logger(KairosProcessor.name);

  constructor(
    @Inject(ServiceNames.INBOX_SERVICE)
    private readonly inboxService: ClientProxy,
  ) {}

  @Process()
  handleTranscode(job: Job) {
    switch (job.data.cbQueue) {
      case RMQ_QUEUE.INBOX: {
        this.inboxService
          .emit(job.data.cbEvent, new RmqRecordBuilder(job.data.cbData).build())
          .subscribe({
            next: () => {
              this.logger.log(
                {
                  data: {
                    cbQueue: job.data?.cbQueue,
                    cbEvent: job.data?.cbEvent,
                  },
                },
                'handleTranscode: Callback event sent',
              );
            },
            error: (err) => {
              this.logger.error(
                { err, data: { cbQueue: job.data.cbQueue } },
                'handleTranscode: Callback event failed',
              );
            },
          });
        break;
      }
      default: {
        this.logger.error(
          { data: { cbQueue: job.data.cbQueue } },
          'Invalid callback queue, please register client',
        );
      }
    }
  }

  @OnQueueError()
  onError(error: Error) {
    this.logger.error({ err: error }, 'Global error');
  }

  @OnQueueCompleted()
  onCompleted(job: Job) {
    this.logger.debug({ data: { jobId: job.id } }, 'Job completed');
  }

  @OnQueueFailed()
  onFailed(job: Job, error: Error) {
    this.logger.error({ err: error, data: { jobId: job.id } }, 'Job failed');
  }

  @OnQueueWaiting()
  onWaiting(jobId: string) {
    this.logger.debug({ data: { jobId } }, 'Job waiting');
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug({ data: { jobId: job.id } }, 'Job active');
  }

  @OnQueueStalled()
  onStalled(job: Job) {
    this.logger.error({ data: { jobId: job.id } }, 'Job stalled');
  }

  @OnQueueProgress()
  onProgress(job: Job, progress: number) {
    this.logger.debug({ data: { jobId: job.id, progress } }, 'Job progress');
  }

  @OnQueueCleaned()
  onCleaned(jobs: Job[], type: string) {
    this.logger.debug({ data: { jobs, type } }, 'Jobs cleaned');
  }

  @OnQueuePaused()
  onPaused() {
    this.logger.debug('Queue paused');
  }

  @OnQueueResumed()
  onResumed() {
    this.logger.debug('Queue resumed');
  }

  @OnQueueDrained()
  onDrained() {
    this.logger.debug('Queue drained');
  }

  @OnQueueRemoved()
  onRemoved(job: Job) {
    this.logger.debug({ data: { jobId: job.id } }, 'Job removed');
  }
}
