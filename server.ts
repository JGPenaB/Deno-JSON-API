import { app } from "./app.ts";
import { HOST, PORT } from "./config/config.ts";

console.log(`Listening at ${HOST}:${PORT}...`);

await app.listen(`${HOST}:${PORT}`);