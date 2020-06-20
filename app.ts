import { Application, isHttpError, Status } from "https://deno.land/x/oak@v5.2.0/mod.ts";
import {HOST, PORT} from "./config/config.ts";

//Importing routes
import userRoutes from "./routes/userRoutes.ts";

const app = new Application();

//Loading routes
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

console.log(`Listening at ${HOST}:${PORT}...`);

export {app};