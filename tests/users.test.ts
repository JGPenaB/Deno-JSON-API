import { axiod, assertEquals } from "../dependencies.ts";
import { HOST, PORT } from "../config/config.ts";
import { app } from "../app.ts";

const baseURL = `http://${HOST}:${PORT}`;
let Listen: Promise<void>;
let controller: AbortController;

async function testInit(){
    controller = new AbortController();
    const { signal } = controller;
    Listen = app.listen({hostname:HOST, port: PORT, signal});
}

async function testEnd(){
    controller.abort();
    await Listen;
}

Deno.test("HTTP Request works", async () => {
    await testInit();
    const response = await axiod.get(`${baseURL}/users`);
    console.log(response.data[0]);
    assertEquals(response.data[0], "Hello");
    await testEnd();
});