import { Application } from "./dependencies.ts";

//Importando rutas
import userRoutes from "./routes/userRoutes.ts";

const app = new Application();

//Cargando rutas
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

app.addEventListener("error", (event) => {
    console.log(event.error);
});

export {app};