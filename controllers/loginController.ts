import { getUserByEmail } from "../services/userService.ts";

import { Controller } from "../interfaces/controllerInterface.ts";
import { bcrypt } from "../dependencies.ts";
import { makeJwt, setExpiration, Jose, Payload } from "../dependencies.ts";
import key from "../config/jwt.ts";

const header: Jose = {
    alg: "HS256",
    typ: "JWT",
};

export class loginController implements Controller {

    async create(context: any){
        const fields: Array<string> = ["email","contrasena"];
        const body = await context.request.body();
        
        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(!body.value[varname].length){
                context.response.body = {data: `El campo ${varname} está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Verifica si el email existe
        const emailFound: any = await getUserByEmail(body.value["email"]);
        if(emailFound !== undefined){
            let result = bcrypt.compare(emailFound[2],body.value["contrasena"]);

            if(result){
                const payload: Payload = {
                    iss: emailFound[0],
                    exp: setExpiration(new Date().getTime() + 50000),
                };
            
                //create jwt previous condition ok
                const jwt = makeJwt({ key, header, payload });

                if(jwt){
                    context.response.body = {
                        data: "Inicio de sesión exitoso.",
                        token: jwt
                    };
                    context.response.status = 200;
                }

                
            }else{
                context.response.body = {data: "Credenciales inválidas."};
                context.response.status = 401;
            }
            
        }else{
            context.response.body = {data: "El correo electrónico no existe."};
            context.response.status = 401;
        }

        return;
    }

}