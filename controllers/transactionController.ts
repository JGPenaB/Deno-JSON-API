import { getTransactions, 
    getTransactionByID, 
    createTransaction } from "../services/transactionService.ts";
import { Transaction } from "../database/types/transaction.ts";
import { Controller } from "../interfaces/controllerInterface.ts";

export class transactionController implements Controller {
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

            const found: Transaction = await getTransactionByID(context.params.id);

            if(found !== undefined){
                jsonData.data.id = context.params.id;
                jsonData.data.concepto = found.description;
                jsonData.data.monto = found.ammount;
                jsonData.data.ingreso = found.entry;

                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ninguna transacción."};
                context.response.status = 404;
            }
        }else{

            //Caso contrario, devuelve todas las transacciones
            jsonData = {data: []};
            const list: any = await getTransactions(context.params.accountID);

            if(list.length){
                list.forEach((item: any) => {
                    jsonData.data.push({
                        id: item.id, 
                        concepto: item.description, 
                        monto: item.ammount
                    });
                });
                context.response.body = jsonData;
                context.response.status = 200;
            }else{
                context.response.body = {data: "No se encontró ninguna transacción para esta cuenta."};
                context.response.status = 404;
            }
        }
    }

    async create(context: any){
        const fields: Array<string> = ["concepto", "monto", "ingreso"];
        const body = await context.request.body();

        //Verifica si un usuario intenta alterar los datos de otro usuario
        if(context.request.tokenInfo.iss !== context.params.userID){
            context.response.body = {data: "Acción no permitida."};
            context.response.status = 401;
            return;
        }
        
        //Verifica que todos los campos no esten vacíos
        for(let varname of fields){
            if(typeof(body.value[varname]) === "string" && !body.value[varname].length){
                context.response.body = {data: `El campo ${varname} está en blanco.`};
                context.response.status = 422;
                return;
            }
        }

        //Creando la cuenta
        const found: any = await createTransaction(context.params.accountID, 
            <Transaction>{
            description: body.value["concepto"],
            ammount: body.value["monto"],
            entry: body.value["ingreso"],
        });

        context.response.body = {data: "Transacción registrada exitosamente."};
        context.response.status = 201;
    }

}