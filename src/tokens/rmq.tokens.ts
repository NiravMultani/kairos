/** Other microservices of project to send rmq events to */
export enum RMQ_QUEUE {
  BDK = 'bdk',
  INBOX = 'inbox',
  KAIROS = 'kairos',
}

export const RMQ_QUEUE_OPTIONS = {
  [RMQ_QUEUE.BDK]: {
    durable: true,
  },
  [RMQ_QUEUE.INBOX]: {
    durable: true,
  },
  [RMQ_QUEUE.KAIROS]: {
    durable: true,
  },
};

export enum RMQ_EVENT {
  SCHEDULE_TASK = 'schedule_task',
  REMOVE_SCHEDULED_TASK = 'remove_scheduled_task',
}

interface IScheduleTaskBase {
  jobId: string;
  /** Data to get back when scheduled event is executed */
  data: any;
  /** When job is executed, receive callback to this queue */
  callbackQueue: RMQ_QUEUE;
  /** When job is executed, receive callback to this event */
  callbackEvent: string;
}

export interface IScheduleTaskPayload extends IScheduleTaskBase {
  type: 'dateTime';
  /** ISO Date to execute this job at */
  date: string;
  /** Timezone - IANA string - Asia/Kolkata */
  tz?: string;
}

export interface ICronTaskPayload extends IScheduleTaskBase {
  type: 'cron';
  /** Cron pattern to execute this job at */
  cron: string;
}

export interface IRmqEventPayload {
  [RMQ_EVENT.SCHEDULE_TASK]: IScheduleTaskPayload | ICronTaskPayload;
  [RMQ_EVENT.REMOVE_SCHEDULED_TASK]: {
    jobId: string;
  };
}
