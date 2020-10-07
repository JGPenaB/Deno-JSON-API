/**
 * @description Middleware que verifica si el cuerpo de la petición es válido.
 */
export async function validateBody(context: any, next: any){

    if(context.request.hasBody){
        const body = await context.request.body();

        if(body.type !== "json"){
            context.response.body = {data: "El formato del formulario no es válido."};
            context.response.status = 400;
            return;
        }
    }else{
        context.response.body = {data: "No se ha recibido ningún dato."};
        context.response.status = 400;
        return;
    }

    await next();
    return;
}