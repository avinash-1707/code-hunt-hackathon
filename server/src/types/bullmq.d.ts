declare module "bullmq" {
  import { EventEmitter } from "events";

  export interface Job<Data = any> {
    id: string | number;
    data: Data;
  }

  export class Queue<Data = any> extends EventEmitter {
    constructor(name: string, opts?: any);
    add(name: string, data: Data, opts?: any): Promise<Job<Data>>;
  }

  export class Worker<Data = any> extends EventEmitter {
    constructor(
      name: string,
      processor: (job: Job<Data>) => Promise<any>,
      opts?: any,
    );
  }

  export class QueueScheduler {
    constructor(name: string, opts?: any);
  }
}
