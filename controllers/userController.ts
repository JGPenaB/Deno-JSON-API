import {getUsers,
    getUserByID,
    createUser,
    getUserByEmail,
    deleteUserByID,
    modifyUser} from "../services/userService.ts";
import {getProfile, createProfile, updateProfile} from "../services/profileService.ts";
import { User } from "../database/types/user.ts";
import { Profile } from "../database/types/profile.ts";
import { Controller } from "../interfaces/controllerInterface.ts";
import { bcrypt } from "../dependencies.ts";

export class userController implements Controller {
    async read(context: any){
        let jsonData: any;

        //Si la id esta definida en la ruta
        if(context.params.id !== undefined){
            jsonData = {data: {}};

            const userFound: User = await getUserByID(context.params.id);

            if(userFound !== undefined){
                jsonData.data.id = context.params.id;
                jsonData.data.nombre = userFound.username;
                jsonData.data.email = userFound.email;

                jsonData.data.perfil = await getProfile(context.params.id);

                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ningún usuario."};
                context.response.status = 404;
            }
        }else{

            //Caso contrario, devuelve todos los usuarios
            jsonData = {data: []};
            const list: any = await getUsers();

            if(list.length){
                list.forEach((item: any) => {
                    jsonData.data.push({id: item.id, nombre: item.username, email: item.email});
                });
                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ningún usuario."};
                context.response.status = 404;
            }
        }
    }

    async create(context: any){
        const fields: Array<string> = ["nombre","email","contrasena","nombres","apellidos","fechaNacimiento","pais"];
        const body = await context.request.body();
        
        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(body.value[varname] === undefined){
                context.response.body = {data: `El campo "${varname}" no está presente.`};
                context.response.status = 422;
                return;
            }
            if(!body.value[varname].length){
                context.response.body = {data: `El campo "${varname}" está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Verifica si el email no está en uso
        let emailFound: User = await getUserByEmail(body.value["email"]);
        if(emailFound !== undefined){
            context.response.body = {data: "El Email ya está registrado."};
            context.response.status = 400;
            return;
        }
        
        let encrypted = await bcrypt.hash(body.value["contrasena"]);

        //Creando el usuario
        await createUser(<User>{
            username: body.value["nombre"],
            email: body.value["email"],
            contrasena: encrypted,
        });

        //El usuario ya está registrado, ahora crea el perfil
        emailFound = await getUserByEmail(body.value["email"]);

        await createProfile(emailFound.id, <Profile>{
            firstNames: body.value["nombres"],
            lastNames: body.value["apellidos"],
            birthdate: body.value["fechaNacimiento"],
            country: body.value["pais"],
        });

        context.response.body = {data: "Usuario creado exitosamente."};
        context.response.status = 201;
    }

    async update(context: any){
        const fields: Array<string> = ["nombre","email","contrasena","nombres","apellidos","fechaNacimiento","pais"];
        const body = await context.request.body();

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.id){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }

        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(body.value[varname] === undefined){
                context.response.body = {data: `El campo "${varname}" no está presente.`};
                context.response.status = 422;
                return;
            }
            if(!body.value[varname].length){
                context.response.body = {data: `El campo "${varname}" está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Verifica si el email no está en uso
        const emailFound: User = await getUserByEmail(body.value["email"]);
        if(emailFound !== undefined && emailFound.id != context.params.id){
            context.response.body = {data: "El Email ya está registrado."};
            context.response.status = 400;
            return;
        }
        
        let encrypted = await bcrypt.hash(body.value["contrasena"]);

        //Editando el usuario
        await modifyUser(<User>{
            username: body.value["nombre"],
            email: body.value["email"],
            contrasena: encrypted,
        }, context.params.id);

        await updateProfile(context.params.id, <Profile>{
            firstNames: body.value["nombres"],
            lastNames: body.value["apellidos"],
            birthdate: body.value["fechaNacimiento"],
            country: body.value["pais"],
        });

        context.response.body = {data: "Usuario editado exitosamente."};
        context.response.status = 200;
    }

    async delete(context: any){

        //Verifica si el usuario existe
        const userFound: any = await getUserByID(context.params.id);
        if(userFound === undefined){
            context.response.body = {data: "No se encontró ningún usuario."};
            context.response.status = 404;
            return;
        }

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.id){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }

        await deleteUserByID(context.params.id);
        context.response.body = {data: "Usuario eliminado exitosamente."};
        context.response.status = 200;
    }


}