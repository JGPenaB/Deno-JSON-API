import client from "../database/dbClient.ts";
import { Account } from "../database/types/account.ts";

async function getAccounts(userID: any){
    var data: Array<Account> = [];

    await client.connect();
    const result = await client.query("SELECT ID, Tipo, Saldo FROM Cuentas WHERE ID_Usuario = $1", userID);
    await client.end();

    for(let element of result.rows){
        data.push({
            id: element[0],
            type: element[1],
            balance: element[2],
        });
    }

    return data;
}

async function getAccountByID(ID: any){
    await client.connect();
    const result = await client.query("SELECT ID, Tipo, Saldo FROM Cuentas WHERE ID = $1", ID);
    await client.end();

    if(result.rows.length){
        return <Account>{
            id: result.rows[0][0],
            type: result.rows[0][1],
            balance: result.rows[0][2],
        };
    }else{
        return result.rows[0];
    }
}

async function createAccount(userID: any, Data: Account){
    await client.connect();
    const result = await client.query("INSERT INTO Cuentas(ID_Usuario, Tipo, Saldo) VALUES($1, $2, 0)", userID, Data.type);
    await client.end();
    return result.rows[0];
}

async function updateAccountByID(Data: Account, ID: any){
    await client.connect();
    const result = await client.query("UPDATE Cuentas SET Tipo = $1 WHERE ID = $2", Data.type, ID);
    await client.end();
    return result.rows[0];
}

async function deleteAccountByID(ID: any){
    await client.connect();
    const result = await client.query("DELETE FROM Cuentas WHERE ID = $1", ID);
    await client.end();
    return result.rows[0];
}


export { getAccounts, getAccountByID, createAccount, updateAccountByID, deleteAccountByID }