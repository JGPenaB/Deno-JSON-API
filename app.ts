import { Application, isHttpError, Status } from "./dependencies.ts";

//Importando rutas
import userRoutes from "./routes/userRoutes.ts";

const app = new Application();

app.use(async (context, next) => {
    try {
        await next();
    }catch (err){
        console.log(err);

        if(isHttpError(err)){
            switch(err.status){
                case Status.UnsupportedMediaType:
                    context.response.body = {data: "La petición no posee el encabezado Content-Type."};
                    context.response.status = 400;
                break;
            }
        }else{
            //Si no es un error de la petición, es del servidor.
            context.response.body = {data: "Error interno del servidor."};
            context.response.status = 500;
        }

        return;
    }
});

//Cargando rutas
app.use(userRoutes.routes());
app.use(userRoutes.allowedMethods());

export {app};