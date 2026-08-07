import { Resend } from "resend";
import type { WorkerEnv } from "../../types/env";

export function createResendClient(
    env: WorkerEnv
) {

    return new Resend(
        env.RESEND_API_KEY
    );

}