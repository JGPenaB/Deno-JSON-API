import client from "../database/dbClient.ts";
import { Profile } from "../database/types/profile.ts";

async function getProfile(userID: any){
    await client.connect();
    const result = await client.query("SELECT ID, Nombres, Apellidos, Fecha_Nacimiento, Pais FROM Perfil WHERE ID_Usuario = $1", userID);
    await client.end();

    if(result.rows.length){
        return <Profile>{
            id: result.rows[0][0],
            firstNames: result.rows[0][1],
            lastNames: result.rows[0][2],
            birthdate: result.rows[0][3],
            country: result.rows[0][4],
        };
    }else{
        return result.rows[0];
    }
}

async function createProfile(userID: any, Data: Profile){
    await client.connect();
    const result = await client.query("INSERT INTO Perfil(ID_Usuario, Nombres, Apellidos, Fecha_Nacimiento, Pais) VALUES($1,$2,$3,TO_DATE($4,'DD-MM-YYYY'),$5)",
    userID,
    Data.firstNames,
    Data.lastNames,
    Data.birthdate,
    Data.country);

    await client.end();
    return result.rows[0];
}

async function updateProfile(userID: any, Data: Profile){
    await client.connect();
    const result = await client.query("UPDATE Perfil SET Nombres = $1, Apellidos = $2, Fecha_Nacimiento = TO_DATE($3,'DD-MM-YYYY') , Pais = $4 WHERE ID_Usuario = $5",
    Data.firstNames,
    Data.lastNames,
    Data.birthdate,
    Data.country,
    userID);

    await client.end();
    return result.rows[0];
}


export { getProfile, createProfile, updateProfile };