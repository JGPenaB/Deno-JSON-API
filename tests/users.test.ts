import { axiod, assertEquals } from "../dependencies.ts";
import { HOST, PORT } from "../config/config.ts";
import { app } from "../app.ts";

const baseURL = `http://${HOST}:${PORT}`;
let Listen: Promise<void>;
let controller: AbortController;

async function testInit(){
    controller = new AbortController();
    const { signal } = controller;
    Listen = app.listen({hostname: HOST, port: PORT, signal});
}

async function testEnd(){
    controller.abort();
    await Listen;
}

Deno.test("POST /users - Evaluando la creacion de usuarios", async () => {
    await testInit();
    const response = await axiod.post(`${baseURL}/users`,{
        nombre: "nuevo",
        contrasena: "1234567",
        email: "area_5@hotmail.es",
    });
    
    console.log("Evaluando el formato...");
    assertEquals(typeof(response.data), "object");
    console.log("Evaluando status...");
    assertEquals(response.status, 201);
    await testEnd();
});

Deno.test("POST /users - Esperando error 400 por usar un correo ya existente", async () => {
    await testInit();
    const response = await axiod.post(`${baseURL}/users`,{
        nombre: "nuevo",
        contrasena: "1234567",
        email: "area_5@hotmail.es",
    }).catch( (error) => {
        assertEquals(error.response.status, 400);
    });
    await testEnd();
});

Deno.test("POST /users - Esperando error 422 por dejar un campo en blanco", async () => {
    await testInit();
    const response = await axiod.post(`${baseURL}/users`,{
        nombre: "nuevo",
        contrasena: "",
        email: "area_5@hotmail.es",
    }).catch( (error) => {
        assertEquals(error.response.status, 422);
    });
    await testEnd();
});

Deno.test("GET /users - Evaluando el formato", async () => {
    await testInit();
    const response = await axiod.get(`${baseURL}/users`);
    assertEquals(typeof(response), "object");
    assertEquals(typeof(response.data), "object");
    await testEnd();
});

