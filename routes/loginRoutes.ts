import { Router } from "../dependencies.ts";
import { loginController } from "../controllers/loginController.ts";
import { validateBody } from "../middlewares/validateBody.ts";

const loginRoutes = new Router();

const methods: loginController = new loginController;

export default loginRoutes
    .post("/login", validateBody, methods.create);