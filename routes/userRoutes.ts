import { Router } from "../dependencies.ts";
import { userList } from "../controllers/userController.ts";

const userRoutes = new Router();

userRoutes
.get("/users", userList)
.post("/users", userList);

export default userRoutes;