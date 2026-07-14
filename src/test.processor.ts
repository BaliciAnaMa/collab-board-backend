import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';

@Processor('test-queue')
export class TestProcessor extends WorkerHost {
  async process(job: Job): Promise<any> {
    console.log("primit si executat:", job.data);
  }
}