import { Queue, Worker, QueueScheduler } from "bullmq";
import type { Job } from "bullmq";
import { env } from "../config/env.js";
// prisma update removed, just logging because resumeAnalysis field isn't def!ined

// create scheduler (required for delayed/repeatable jobs)
new QueueScheduler("resumeAnalysis", {
  connection: { connectionString: env.REDIS_URL },
});

export const resumeQueue = new Queue("resumeAnalysis", {
  connection: { connectionString: env.REDIS_URL },
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
  },
});

// worker to process jobs
export const resumeWorker = new Worker(
  "resumeAnalysis",
  async (
    job: Job<{ resumeUrl: string; candidateId: string; jobId: string }>,
  ) => {
    const { resumeUrl, candidateId, jobId } = job.data;

    console.log("[resumeWorker] analyzing resume", resumeUrl);
    // placeholder for AI analysis logic
    // e.g. call an external API or run local model
    await new Promise((r) => setTimeout(r, 3000));

    // mock storing the result - no DB field defined
    console.log("[resumeWorker] completed analysis for", candidateId);
  },
  {
    connection: { connectionString: env.REDIS_URL },
  },
);

resumeWorker.on("completed", (job: Job) => {
  console.log(`[resumeWorker] job ${job.id} completed`);
});

resumeWorker.on("failed", (job: Job | null, err: Error) => {
  console.error("[resumeWorker] job failed", job?.id, err);
});

export async function enqueueResumeAnalysis(data: {
  resumeUrl: string;
  candidateId: string;
  jobId: string;
}) {
  await resumeQueue.add("analyze", data);
}
