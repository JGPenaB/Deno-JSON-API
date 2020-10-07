import { getAccounts, 
    getAccountByID, 
    createAccount, 
    updateAccountByID,
     deleteAccountByID } from "../services/accountService.ts";

import { Account } from "../database/types/account.ts";

import { Controller } from "../interfaces/controllerInterface.ts";

export class accountController implements Controller {
    async read(context: any){
        let jsonData: any;

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.userID){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }

        //Si la id esta definida en la ruta
        if(context.params.id !== undefined){
            jsonData = {data: {}};

            const found: Account = await getAccountByID(context.params.id);

            if(found !== undefined){
                jsonData.data.id = context.params.id;
                jsonData.data.tipo = found.type;
                jsonData.data.saldo = found.balance;

                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ninguna cuenta."};
                context.response.status = 404;
            }
        }else{

            //Caso contrario, devuelve todas las cuentas
            jsonData = {data: []};
            const list: any = await getAccounts(context.params.userID);

            if(list.length){
                list.forEach((item: any) => {
                    jsonData.data.push({id: item.id, tipo: item.type, saldo: item.balance});
                });
                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ninguna cuenta."};
                context.response.status = 404;
            }
        }
    }

    async create(context: any){
        const fields: Array<string> = ["tipo"];
        const body = await context.request.body();

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.userID){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }
        
        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(!body.value[varname].length){
                context.response.body = {data: `El campo ${varname} está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Creando la cuenta
        const found: any = await createAccount(context.params.userID, <Account>{
            type: body.value["tipo"]
        });

        context.response.body = {data: "Cuenta creada exitosamente."};
        context.response.status = 201;
    }

    async update(context: any){
        const fields: Array<string> = ["tipo"];
        const body = await context.request.body();

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.userID){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }

        //Verifica si la cuenta existe
        const accountFound: any = await getAccountByID(context.params.id);
        if(accountFound === undefined){
            context.response.body = {data: "No se encontró ninguna cuenta."};
            context.response.status = 404;
            return;
        }

        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(!body.value[varname].length){
                context.response.body = {data: `El campo ${varname} está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Editando el usuario
        const found: any = await updateAccountByID(<Account>{
            type: body.value["tipo"]
        }, context.params.id);

        context.response.body = {data: "Cuenta editada exitosamente."};
        context.response.status = 200;
    }

    async delete(context: any){

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.userID){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }

        //Verifica si la cuenta existe
        const accountFound: any = await getAccountByID(context.params.id);
        if(accountFound === undefined){
            context.response.body = {data: "No se encontró ninguna cuenta."};
            context.response.status = 404;
            return;
        }

        const deleted: any = await deleteAccountByID(context.params.id);
        context.response.body = {data: "Cuenta eliminada exitosamente."};
        context.response.status = 200;
    }


}