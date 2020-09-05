import { Client } from "../dependencies.ts";
import { config } from "../dependencies.ts";

let envs = config();

const dbClient = new Client({
    hostname: envs.HOST,
    port: parseInt(envs.PORT),
    user: envs.USER,
    password: envs.PASSWORD,
    database: envs.DATABASE
});

export default dbClient;