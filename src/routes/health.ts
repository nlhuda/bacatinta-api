import { json } from "../utils/cors";
import { success } from "../utils/response";

export async function healthHandler(
    request: Request
){
    return json(
        success(
            "API healthy",
            {
                service:"bacatinta-api",
                version:"1.0.0"
            }
        )
    );
}