JSON API sencilla hecho en Deno con deno-postgres.

## Instalación

```
$ git clone https://github.com/JGPenaB/Deno-JSON-API.git
$ cd Deno-JSON-API
```

Crea un archivo .env con los siguientes datos:
```
HOST= host del sitio (localhost)
PORT= puerto del sitio
USER= usuario de la BDD
PASSWORD= contraseña de la BDD
DATABASE= nombre de la BDD
```

Luego, importa las dependencias del proyecto a la caché de Deno:

```
$ deno cache --reload --lock=lock.json dependencies.ts
```

Por último, ejecuta el server:

```
$ deno run --allow-net --allow-read --unstable server.ts
```

## Pruebas de Integración

```
$ deno test --allow-read --allow-net --unstable tests/
```
