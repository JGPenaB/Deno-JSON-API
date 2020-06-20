import { app } from "./app.ts";
import { HOST, PORT } from "./config/config.ts";

await app.listen(`${HOST}:${PORT}`);