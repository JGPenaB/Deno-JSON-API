import client from "../database/dbClient.ts";

async function getUsers(){
    await client.connect();
    const result = await client.query("SELECT ID, Nombre, Email FROM Usuarios");
    await client.end();
    return result.rows;
}

async function getUserByID(ID: any){
    await client.connect();
    const result = await client.query("SELECT Nombre, Email FROM Usuarios WHERE ID = $1",ID);
    await client.end();
    return result.rows[0];
}

async function getUserByEmail(Email: any){
    await client.connect();
    const result = await client.query("SELECT ID, Nombre, Email FROM Usuarios WHERE Email = $1",Email);
    await client.end();
    return result.rows[0];
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