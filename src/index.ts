import { router } from "./router";
import type { WorkerEnv } from "./types/env";

export default {

  async fetch(
    request: Request,
    env: WorkerEnv
  ) {

    return router(request, env);

  },

} satisfies ExportedHandler<WorkerEnv>;