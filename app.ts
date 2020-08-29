import { Application } from "./dependencies.ts";
import { HOST, PORT } from "./config/config.ts";

//Importing routes
import userRoutes from "./routes/userRoutes.ts";

const app = new Application();

//Loading routes
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export {app};