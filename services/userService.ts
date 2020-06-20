import client from "../database/client.ts";

async function getUsers(){
    await client.connect();
    
    const result = await client.query("SELECT 'Hello'");
    console.log(result.rows);
    await client.end();

    return result.rows[0];
}

export { getUsers };