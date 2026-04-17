import { Queue, Worker, Job } from 'bullmq';
export declare const createQueue: (name: string) => Queue<any, any, string, any, any, string>;
export declare const createWorker: (name: string, processor: (job: Job) => Promise<any>) => Worker<any, any, string>;
