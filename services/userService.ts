import client from "../database/dbClient.ts";
import { User } from "../database/types/user.ts";

async function getUsers(){
    var data: Array<User> = [];

    await client.connect();
    const result = await client.query("SELECT ID, Nombre, Email FROM Usuarios");
    await client.end();

    for(let element of result.rows){
        data.push({
            id: element[0],
            username: element[1],
            email: element[2],
        });
    }

    return data;
}

async function getUserByID(ID: any){
    await client.connect();
    const result = await client.query("SELECT Nombre, Email FROM Usuarios WHERE ID = $1",ID);
    await client.end();

    if(result.rows.length){
        return <User>{
            id: ID,
            username: result.rows[0][0],
            email: result.rows[0][1],
        };
    }else{
        return result.rows[0];
    }
}

async function getUserByEmail(Email: any){
    await client.connect();
    const result = await client.query("SELECT ID, Nombre, Email, Contrasena FROM Usuarios WHERE Email = $1",Email);
    await client.end();

    if(result.rows.length){
        return <User>{
            id: result.rows[0][0],
            username: result.rows[0][1],
            email: result.rows[0][2],
            contrasena: result.rows[0][3],
        };
    }else{
        return result.rows[0];
    }
}

async function createUser(userData: any){
    await client.connect();
    const result = await client.query("INSERT INTO Usuarios(Nombre, Email, Contrasena) VALUES($1,$2,$3)",userData.nombre,userData.email,userData.contrasena);
    await client.end();
    return result.rows[0];
}

async function modifyUser(userData: any, ID: any){
    await client.connect();
    const result = await client.query("UPDATE Usuarios SET Nombre = $1, Email = $2, Contrasena = $3 WHERE ID = $4",userData.nombre,userData.email,userData.contrasena,ID);
    await client.end();
    return result.rows[0];
}

async function deleteUserByID(ID: any){
    await client.connect();
    const result = await client.query("DELETE FROM Usuarios WHERE ID = $1",ID);
    await client.end();
    return result.rows;
}


export { getUsers, getUserByID, createUser, getUserByEmail, deleteUserByID, modifyUser};