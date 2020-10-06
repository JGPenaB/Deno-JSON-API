import { Router } from "../dependencies.ts";
import { userController } from "../controllers/userController.ts";
import { validateBody } from "../middlewares/validateBody.ts";

const userRoutes = new Router();

const methods: userController = new userController;

export default userRoutes
    .get("/users", methods.read)
    .get("/users/:id",methods.read)
    .post("/users", validateBody, methods.create)
    .put("/users/:id", validateBody, methods.update)
    .delete("/users/:id", methods.delete);