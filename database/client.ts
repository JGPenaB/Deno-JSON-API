import { Client } from "../dependencies.ts";
import { config } from "../dependencies.ts";

let envs = config();

const client = new Client({
    hostname: envs.HOST,
    port: envs.PORT,
    user: envs.USER,
    database: envs.DATABASE
});

export default client;