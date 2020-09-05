import {getUsers,
    getUserByID,
    createUser,
    getUserByEmail,
    deleteUserByID,
    modifyUser} from "../services/userService.ts";

/** Lista de usuarios */
async function userList(context: any){

    let jsonData: any = {data: []};

    const list: any = await getUsers();

    if(list.length){
        list.forEach((item: any) => {
            jsonData.data.push({id: item[0], nombre: item[1], email: item[2]});
        });
        context.response.body = jsonData;
        context.response.status = 200;
    }else{
        context.response.body = {data: "No se encontró ningún usuario."};
        context.response.status = 404;
    }
};

/** Información específica de un usuario */
async function userByID(context: any){

    let jsonData: any = {data: {}};

    const found: any = await getUserByID(context.params.id);

    if(found !== undefined){
        jsonData.data.id = context.params.id;
        jsonData.data.nombre = found[0];
        jsonData.data.email = found[1];
        context.response.body = jsonData;
        context.response.status = 200;
    }else{
        context.response.body = {data: "No se encontró ningún usuario."};
        context.response.status = 404;
    }
};

/** Creación de usuario */
async function newUser(context: any){

    const body = await context.request.body();

    if(!context.request.hasBody){
        context.response.body = {data: "No se ha enviado ningún dato."};
        context.response.status = 400;
        return;
    }

    //Verifica si el email no está en uso
    const emailFound: any = await getUserByEmail(body.value.get("email"));
    if(emailFound !== undefined){
        context.response.body = {data: "El Email ya está registrado."};
        context.response.status = 400;
        return;
    }
    
    //Creando el usuario
    const found: any = await createUser({
        nombre: body.value.get("nombre"),
        email: body.value.get("email"),
        contrasena: body.value.get("contrasena"),
    });

    context.response.body = {data: "Usuario creado exitosamente."};
    context.response.status = 201;
};

/** Edición de Usuario */
async function editUser(context: any){
    const body = await context.request.body();

    if(!context.request.hasBody){
        context.response.body = {data: "No se ha enviado ningún dato."};
        context.response.status = 400;
        return;
    }

    //Verifica si el email no está en uso
    const emailFound: any = await getUserByEmail(body.value.get("email"));
    if(emailFound !== undefined && emailFound[0] != context.params.id){
        context.response.body = {data: "El Email ya está registrado."};
        context.response.status = 400;
        return;
    }
    
    //Editando el usuario
    const found: any = await modifyUser({
        nombre: body.value.get("nombre"),
        email: body.value.get("email"),
        contrasena: body.value.get("contrasena"),
    }, context.params.id);

    context.response.body = {data: "Usuario editado exitosamente."};
    context.response.status = 200;
}

/** Eliminación de usuarios */
async function deleteUser(context: any){

    //Verifica si el usuario existe
    const userFound: any = await getUserByID(context.params.id);
    if(userFound === undefined){
        context.response.body = {data: "No se encontró ningún usuario."};
        context.response.status = 404;
        return;
    }

    const deleted: any = await deleteUserByID(context.params.id);
    context.response.body = {data: "Usuario eliminado exitosamente."};
    context.response.status = 200;
};

export { userList, userByID, newUser, deleteUser, editUser };