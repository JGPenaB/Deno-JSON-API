import { Router } from "../dependencies.ts";
import { transactionController } from "../controllers/transactionController.ts";
import { validateBody } from "../middlewares/validateBody.ts";
import { isAuthorized } from "../middlewares/isAuthorized.ts";

const transactionRoutes = new Router();

const methods: transactionController = new transactionController;

export default transactionRoutes
    .get("/users/:userID/accounts/:accountID/transactions", isAuthorized, methods.read)
    .get("/users/:userID/accounts/:accountID/transactions/:id", isAuthorized, methods.read)
    .post("/users/:userID/accounts/:accountID/transactions", isAuthorized, validateBody, methods.create);