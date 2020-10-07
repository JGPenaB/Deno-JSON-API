import { Router } from "../dependencies.ts";
import { accountController } from "../controllers/accountController.ts";
import { validateBody } from "../middlewares/validateBody.ts";
import { isAuthorized } from "../middlewares/isAuthorized.ts";

const accountRoutes = new Router();

const methods: accountController = new accountController;

export default accountRoutes
    .get("/users/:userID/accounts", isAuthorized, methods.read)
    .get("/users/:userID/accounts/:id", isAuthorized, methods.read)
    .post("/users/:userID/accounts", isAuthorized, validateBody, methods.create)
    .put("/users/:userID/accounts/:id", isAuthorized, validateBody, methods.update)
    .delete("/users/:userID/accounts/:id", isAuthorized, methods.delete);