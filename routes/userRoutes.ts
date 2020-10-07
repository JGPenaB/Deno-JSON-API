import { Router } from "../dependencies.ts";
import { userController } from "../controllers/userController.ts";
import { validateBody } from "../middlewares/validateBody.ts";
import { isAuthorized } from "../middlewares/isAuthorized.ts";

const userRoutes = new Router();

const methods: userController = new userController;

export default userRoutes
    .get("/users", methods.read)
    .get("/users/:id",methods.read)
    .post("/users", validateBody, methods.create)
    .put("/users/:id", isAuthorized, validateBody, methods.update)
    .delete("/users/:id", isAuthorized, methods.delete);