import client from "../database/dbClient.ts";
import { Transaction } from "../database/types/transaction.ts";

async function getTransactions(accountID: any){
    var data: Array<Transaction> = [];

    await client.connect();
    const result = await client.query("SELECT ID, Concepto, Monto, Ingreso FROM Transacciones WHERE ID_Cuenta = $1", accountID);
    await client.end();

    for(let element of result.rows){
        data.push({
            id: element[0],
            description: element[1],
            ammount: element[2],
            entry: element[3],
        });
    }

    return data;
}

async function getTransactionByID(ID: any){
    await client.connect();
    const result = await client.query("SELECT ID, Concepto, Monto, Ingreso FROM Transacciones WHERE ID = $1", ID);
    await client.end();

    if(result.rows.length){
        return <Transaction>{
            id: result.rows[0][0],
            description: result.rows[0][1],
            ammount: result.rows[0][2],
            entry: result.rows[0][3]
        };
    }else{
        return result.rows[0];
    }
}

async function createTransaction(accountID: any, Data: Transaction){
    await client.connect();
    var result = await client.query("INSERT INTO Transacciones(ID_Cuenta, Concepto, Monto, Ingreso) VALUES($1, $2, $3, $4)", 
    accountID, Data.description, Data.ammount, Data.entry);

    if(Data.entry){
        await client.query("UPDATE Cuentas SET Saldo = (SELECT Saldo FROM Cuentas WHERE ID = $1) + $2 WHERE ID = $1", accountID, Data.ammount);
    }else{
        await client.query("UPDATE Cuentas SET Saldo = (SELECT Saldo FROM Cuentas WHERE ID = $1) - $2 WHERE ID = $1", accountID, Data.ammount);
    }
    
    await client.end();
    return result.rows[0];
}

export { getTransactions, getTransactionByID, createTransaction }