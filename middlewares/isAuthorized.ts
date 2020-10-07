/**
 * @description Middleware que verifica si el token enviado es válido para una ruta que necesite
 * autenticación.
 */
import { validateJwt, Payload } from "../dependencies.ts";
import key from "../config/jwt.ts";

const isAuthorized = async (context: any, next: any) => {

	const headerInfo = context.request.headers.get("Authorization");

	if (!headerInfo) {
		context.response.body = { data: "Header : Authorization" };
		context.response.status = 401;
		return;
	}

	const jwt = headerInfo.split(" ")[1];

	if (!jwt) {
		context.response.body = { data: "Se requiere de un Bearer token para acceder a esta ruta." };
		context.response.status = 401;
		return;
	}

	//Extrae la información del token
	const tokenInfo = await validateJwt({jwt, key, algorithm: "HS256" });

	//Si es válido, guarda los datos decodificados
	if(tokenInfo.isValid){
		let pload: Payload = <Payload>tokenInfo.payload;
		context.request.tokenInfo = pload;
		await next();
		return;
	}

	context.response.body = { data: "El token es inválido o ha expirado." };
	context.response.status = 401;
};

export { isAuthorized };